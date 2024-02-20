export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  // role: {
  //   _id: string;
  //   name: string;
  // };
  // permissions?: {
  //   _id: string;
  //   name: string;
  //   apiPath: string;
  //   module: string;
  // }[]
}
