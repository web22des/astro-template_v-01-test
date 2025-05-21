/// <reference types="astro/client" />

declare namespace App {
    interface Frontmatter {
        date: string;
        title: string;
        [key: string]: any;
    }
}
