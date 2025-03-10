import apiClient from "./api-client";

interface IUpoloadResponse {
    url: string;
}
export const uploadPhoto = async (photo: File) => {
    return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            apiClient.post<IUpoloadResponse>('files?file=123.jpeg', formData, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            }).then(res => {
                resolve(res.data.url);
            }).catch(err => {
                reject(err);
            });
        }
    });
}