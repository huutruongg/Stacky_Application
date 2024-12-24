import { IProfile } from "../interfaces/ICandidate";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public getAllUsers = async () => {
    return this.userRepository.findAll();
  };

  public getUserById = async (id: string) => {
    return this.userRepository.findById(id);
  };

  public createUser = async (data: any) => {
    return this.userRepository.createUser(data);
  };

  public changePassword = async (id: string, password: string) => {
    return this.userRepository.changePassword(id, password);
  };

  public deleteUser = async (id: string) => {
    return this.userRepository.delete(id);
  };

  public getUserByEmail = async (email: string) => {
    return this.userRepository.findOne(email);
  };

  public updateUserProfile = async (id: string, data: IProfile) => {
    const userUpdate = { phoneNumber: data.phoneNumber };
    return this.userRepository.update(id, userUpdate);
  };
}