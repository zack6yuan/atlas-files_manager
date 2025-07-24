#!/usr/bin/env node
// controllers/FilesController.js

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const Bull = require('bull');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const fileQueue = new Bull('fileQueue');

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!name) return res.status(400).send({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) return res.status(400).send({ error: 'Missing type' });
    if (type !== 'folder' && !data) return res.status(400).send({ error: 'Missing data' });

    let parentObjectId = parentId;
    if (parentId !== 0) {
      try {
        parentObjectId = new ObjectId(parentId);
      } catch {
        return res.status(400).send({ error: 'Parent not found' });
      }

      const parent = await dbClient.db.collection('files').findOne({ _id: parentObjectId });
      if (!parent) return res.status(400).send({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
    }

    const fileDocument = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? 0 : parentObjectId,
    };

    if (type === 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDocument);
      return res.status(201).send({ id: result.insertedId, userId, name, type, isPublic, parentId });
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    await fs.promises.mkdir(folderPath, { recursive: true });

    const fileName = uuidv4();
    const localPath = path.join(folderPath, fileName);
    await fs.promises.writeFile(localPath, Buffer.from(data, 'base64'));

    fileDocument.localPath = localPath;

    const result = await dbClient.db.collection('files').insertOne(fileDocument);

    // Add thumbnail generation job
    if (type === 'image') {
      await fileQueue.add({ userId, fileId: result.insertedId });
    }

    return res.status(201).send({ id: result.insertedId, userId, name, type, isPublic, parentId });
  }

  static async getFile(req, res) {
    const fileId = req.params.id;
    const token = req.header('X-Token');
    const size = req.query.size;

    if (!ObjectId.isValid(fileId)) return res.status(404).send({ error: 'Not found' });

    const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId) });
    if (!file) return res.status(404).send({ error: 'Not found' });

    if (file.type === 'folder') return res.status(400).send({ error: "A folder doesn't have content" });

    if (!file.isPublic) {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId || userId !== file.userId.toString()) return res.status(404).send({ error: 'Not found' });
    }

    let filePath = file.localPath;
    if (size && ['100', '250', '500'].includes(size)) {
      filePath = `${file.localPath}_${size}`;
    }

    try {
      const fileContent = await fs.promises.readFile(filePath);
      const mimeType = mime.lookup(file.name) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      return res.status(200).send(fileContent);
    } catch {
      return res.status(404).send({ error: 'Not found' });
    }
  }

  static async getShow(req, res) {
    const token = req.header('X-Token');
    const fileId = req.params.id;

    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    if (!ObjectId.isValid(fileId)) return res.status(404).send({ error: 'Not found' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const file = await dbClient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
      userId: new ObjectId(userId),
    });

    if (!file) return res.status(404).send({ error: 'Not found' });

    return res.status(200).send({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async putPublish(req, res) {
    const token = req.header('X-Token');
    const fileId = req.params.id;

    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    if (!ObjectId.isValid(fileId)) return res.status(400).send({ error: 'Invalid file ID' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });
    if (!file) return res.status(404).send({ error: 'Not found' });

    await dbClient.db.collection('files').updateOne({ _id: new ObjectId(fileId) }, { $set: { isPublic: true } });

    file.isPublic = true;
    return res.status(200).send(file);
  }

  static async putUnpublish(req, res) {
    const token = req.header('X-Token');
    const fileId = req.params.id;

    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    if (!ObjectId.isValid(fileId)) return res.status(400).send({ error: 'Invalid file ID' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });
    if (!file) return res.status(404).send({ error: 'Not found' });

    await dbClient.db.collection('files').updateOne({ _id: new ObjectId(fileId) }, { $set: { isPublic: false } });

    file.isPublic = false;
    return res.status(200).send(file);
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page, 10) || 0;

    const query = {
      userId: new ObjectId(userId),
      parentId: parentId === 0 ? 0 : new ObjectId(parentId),
    };

    const files = await dbClient.db.collection('files')
      .aggregate([{ $match: query }, { $skip: page * 20 }, { $limit: 20 }])
      .toArray();

    const response = files.map((file) => ({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    }));

    return res.status(200).send(response);
  }
}

module.exports = FilesController;
