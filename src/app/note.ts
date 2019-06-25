export class Note {
    static serial = 0;
    id: number;
    title: string;
    content: string;
    color: string;

    constructor(options: {
        title?: string,
        content?: string,
        color?: string,
    } = {}) {
        this.id = parseInt(localStorage.getItem('NOTE_SERIAL') || '0', 10);
        localStorage.setItem('NOTE_SERIAL', (this.id + 1).toString());

        this.title = options.title || '';
        this.content = options.content || '';
        this.color = options.color || '';
    }
}
