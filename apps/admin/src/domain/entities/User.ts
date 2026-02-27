export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  role: string;
}
