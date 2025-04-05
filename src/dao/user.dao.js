import userModel from './models/user.model.js'

class UserDao {
	async save(userData) {
		const user = new userModel(userData);
		return await user.save();
	}

	async findById(uid) {
		return await userModel.findById(uid);
	}

	async findOne(query) {
		return await userModel.findOne(query)
	}
}

export default new UserDao();