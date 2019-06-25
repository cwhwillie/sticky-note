export class Note {
    static serial = 0;
    id: number;
    title: string;
    content: string;
    color: string;
    x: number;
    y: number;
    z: number;

    constructor(options: {
        title?: string,
        content?: string,
        color?: string,
        x?: number,
        y?: number,
        z?: number
    } = {}) {
        this.id = parseInt(localStorage.getItem('NOTE_SERIAL') || '0', 10);
        localStorage.setItem('NOTE_SERIAL', (this.id + 1).toString());

        this.title = options.title || '';
        this.content = options.content || '';
        this.color = options.color || '';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.z = options.z || 0;
    }
}