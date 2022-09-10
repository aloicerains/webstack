export interface UserData {
  name: string,
  email: string,
  phoneNumber: number,
  userType: string,
  password: string
};

export interface resUserData {
  id: string,
  name: string,
  email: string,
  phoneNumber: number,
  userType: string
}

export interface AuthData {
  email: string,
  password: string,
}
