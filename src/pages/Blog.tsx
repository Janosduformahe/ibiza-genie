import { BlogList } from "@/components/BlogList";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand to-white">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ibiza-night mb-4">
            Ibiza Insider Blog
          </h1>
          <p className="text-gray-600">
            Discover the best of Ibiza through our curated guides and local insights
          </p>
        </div>
        <BlogList />
      </div>
    </div>
  );
};

export default Blog;