import { BlogPost } from "@/components/BlogPost";

const BlogPostPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand to-white">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <BlogPost />
      </div>
    </div>
  );
};

export default BlogPostPage;