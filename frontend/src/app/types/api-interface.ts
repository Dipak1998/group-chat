export interface IUserApiResponse{
    email:string;
    id:number;
    mobile_no: string;
    name : string;
    role_id:number;
    status:number
}

export interface IGroupListApiResponse{
    id: number;
    group_name: string;
    members: string;
    user_id: number;
    status: number
}

export interface IMessageApiReponse{
    id: number;
    message: string;
    group_id: number;
    user_id: number;
    user:IUserApiResponse;
    likes: number;
    like_user_id: Array<any> |any;
    status: number;
    createdAt?:string;
    updatedAt?:string;
}