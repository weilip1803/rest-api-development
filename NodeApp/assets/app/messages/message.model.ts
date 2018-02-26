export class Message {
    public text: string;
    public title: string;
    public author: string;
    public publish_date: string;
    public public: boolean;
    public id :number;

    constructor(title?: string,
                isPublic?: boolean,text?: string ) {
        this.title = title;
        this.public = isPublic;
        this.text = text;
    }
}