export type NewestLikesType = {
  id: string;
  login: string;
  addedAt: Date;
};
export type ExtendedLikesInfoType = {
  dislikesCount: number;
  likesCount: number;
  myStatus: string;
  newestLikes: Array<NewestLikesType>;
};
export type PostType = {
  addedAt: Date;
  id?: string;
  title: string | null;
  shortDescription: string | null;
  content: string | null;
  bloggerId: string;
  bloggerName?: string | null;
  extendedLikesInfo: ExtendedLikesInfoType;
};
export type BloggerType = {
  id: string;
  name: string | null;
  youtubeUrl: string | null;
};

export type LikeType = {
  userId: string;
  login: string;
  action: string;
  addedAt: Date;
};

export type CommentType = {
  id: string;
  content: string; //20<len<300
  postId: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
  likesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type EntityWithPaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type QueryDataType = {
  page: number;
  pageSize: number;
  searchNameTerm: string;
};
export type ErrorMessageType = {
  message: string;
  field: string;
};

export type UserType = {
  accountData: UserAccountType;
  //loginAttempts: LoginAttemptType[],
  emailConfirmation: EmailConfirmationType;
};

export type UserViewType = {
  id: string;
  //loginAttempts: LoginAttemptType[],
  login: string;
};

export type UserAccountType = {
  id: string;
  email: string;
  login: string;
  passwordHash: string;
  createdAt: Date;
  revokedTokens?: string[] | null;
};
export type SentConfirmationEmailType = {
  sentDate: Date;
};

export type LoginAttemptType = {
  attemptDate: Date;
  ip: string;
};

export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
  sentEmails?: SentConfirmationEmailType[];
};

export type LimitsControlType = {
  userIp: string;
  url: string;
  time: Date;
};
export type CheckLimitsType = {
  login: string | null;
  userIp: string;
  url: string;
  time: Date;
};

export type EmailConfirmationMessageType = {
  email: string;
  message: string;
  subject: string;
  isSent: boolean;
  createdAt: Date;
};

export enum LikeAction {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
export type LikeActionType = 'Like' | 'Dislike' | 'None';
