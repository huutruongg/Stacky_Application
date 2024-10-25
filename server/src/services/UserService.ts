import { IProfile } from "../interfaces/ICandidate";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async createUser(data: any) {
    return this.userRepository.createUser(data);
  }

  async changePassword(id: string, password: string) {
    return this.userRepository.changePassword(id, password);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne(email);
  }

  async updateUserProfile(id: string, data: IProfile) {
    const userUpdate = { phoneNumber: data.phoneNumber };
    return this.userRepository.update(id, userUpdate);
  }
}