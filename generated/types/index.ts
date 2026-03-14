export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type Company = {
  __typename?: 'Company';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CompanyFiltersInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCompanyInput = {
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateWarehouseInput = {
  accountable_id?: InputMaybe<Scalars['String']['input']>;
  address: Scalars['String']['input'];
  area: Scalars['String']['input'];
  category: Scalars['String']['input'];
  city: Scalars['String']['input'];
  company_id: Scalars['String']['input'];
  country: Scalars['String']['input'];
  description: Scalars['String']['input'];
  price: Scalars['String']['input'];
  state: Scalars['String']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
  zip_code: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCompanyMember?: Maybe<Company>;
  createCompany?: Maybe<Company>;
  createUser: User;
  createWarehouse?: Maybe<Warehouse>;
  login: AuthResponse;
  logout: LogoutResponse;
  logoutAll: LogoutResponse;
  refreshToken: AuthResponse;
  register: AuthResponse;
  removeCompany?: Maybe<Company>;
  removeCompanyMember?: Maybe<Company>;
  removeWarehouse?: Maybe<Warehouse>;
  updateCompany?: Maybe<Company>;
  updatePassword: User;
  updateProfile: User;
  updateUserRole: User;
  updateWarehouse?: Maybe<Warehouse>;
};


export type MutationAddCompanyMemberArgs = {
  company_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateWarehouseArgs = {
  input: CreateWarehouseInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
};


export type MutationRemoveCompanyArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveCompanyMemberArgs = {
  company_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationRemoveWarehouseArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};


export type MutationUpdateWarehouseArgs = {
  input: UpdateWarehouseInput;
};

export type Query = {
  __typename?: 'Query';
  companies?: Maybe<Array<Company>>;
  companiesCount: Scalars['Int']['output'];
  company?: Maybe<Company>;
  getAllUsers: Array<User>;
  getMe: User;
  getMyCompanies?: Maybe<Array<Company>>;
  getUserById: User;
  warehouse?: Maybe<Warehouse>;
  warehouses?: Maybe<Array<Warehouse>>;
  warehousesCount: Scalars['Int']['output'];
};


export type QueryCompaniesArgs = {
  filters?: InputMaybe<CompanyFiltersInput>;
};


export type QueryCompaniesCountArgs = {
  filters?: InputMaybe<CompanyFiltersInput>;
};


export type QueryCompanyArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryWarehouseArgs = {
  id: Scalars['String']['input'];
};


export type QueryWarehousesArgs = {
  filters?: InputMaybe<WarehouseFiltersInput>;
};


export type QueryWarehousesCountArgs = {
  filters?: InputMaybe<WarehouseFiltersInput>;
};

export enum Role {
  Admin = 'ADMIN',
  Investor = 'INVESTOR',
  InvestorAdmin = 'INVESTOR_ADMIN'
}

export type UpdateCompanyInput = {
  id: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type UpdateProfileInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateUserRoleInput = {
  role: Role;
  userId: Scalars['String']['input'];
};

export type UpdateWarehouseInput = {
  id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Role;
  updated_at: Scalars['DateTime']['output'];
};

export type Warehouse = {
  __typename?: 'Warehouse';
  accountable_id: Scalars['String']['output'];
  address: Scalars['String']['output'];
  area: Scalars['String']['output'];
  category: Scalars['String']['output'];
  city: Scalars['String']['output'];
  company_id: Scalars['String']['output'];
  country: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  price: Scalars['String']['output'];
  state: Scalars['String']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  zip_code: Scalars['String']['output'];
};

export type WarehouseFiltersInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};
