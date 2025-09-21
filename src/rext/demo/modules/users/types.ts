import { ConvertFrom, FromField, FromSource } from '../../../Converter';

export class UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string | null;
    suite: string | null;
    city: string | null;
    zipcode: string | null;
  } | null;
}

export class User extends ConvertFrom<UserResponse> {
  @FromField('id')
  id: number;

  @FromField('name', (value: string) => value.split(' ')[0])
  firstName: string;

  @FromField('name', (value: string) => value.split(' ')[1] ?? null)
  lastName: string | null;

  @FromSource((source: UserResponse) => ({
    email: source.email,
    address: source.address?.street ?? null,
  }))
  contactInfo: {
    email: string;
    address: string | null;
  };
}
