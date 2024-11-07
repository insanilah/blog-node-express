class Post {
    constructor(id, title, content, createdAt, updatedAt, slug, published, author, categories, tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
        this.slug = slug;
        this.published = published;
        this.author = author;
        this.categories = categories;
        this.tags = tags;
    }
}

export default Post;
