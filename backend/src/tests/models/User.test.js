const User = require('../../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should require name field', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await expect(user.save()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should validate email format', async () => {
      const user = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await expect(user.save()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should enforce password length of at least 8 characters', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await expect(user.save()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });
  });

  describe('Pre-save Hooks', () => {
    it('should hash password before saving', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await user.save();
      expect(user.password).not.toBe('password123');
      expect(bcrypt.compareSync('password123', user.password)).toBe(true);
    });

    it('should generate employeeId for new users', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await user.save();
      expect(user.employeeId).toMatch(/^EMP\d{3}$/);
    });

    it('should increment employeeId sequentially', async () => {
      const user1 = new User({
        name: 'User One',
        email: 'user1@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      const user2 = new User({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'password123',
        gender: 'female',
        birthday: new Date('1991-01-01'),
      });

      await user1.save();
      await user2.save();

      const id1 = parseInt(user1.employeeId.replace('EMP', ''));
      const id2 = parseInt(user2.employeeId.replace('EMP', ''));
      expect(id2).toBe(id1 + 1);
    });
  });

  describe('Instance Methods', () => {
    it('should correctly compare passwords', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await user.save();
      expect(await user.comparePassword('password123')).toBe(true);
      expect(await user.comparePassword('wrongpassword')).toBe(false);
    });

    it('should remove sensitive data when converted to JSON', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
        birthday: new Date('1990-01-01'),
      });

      await user.save();
      const userJson = user.toJSON();
      expect(userJson.password).toBeUndefined();
      expect(userJson.__v).toBeUndefined();
    });
  });
});