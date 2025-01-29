import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="prose prose-lg max-w-none">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <h1 className="text-4xl font-bold text-ibiza-night mb-4">{post.title}</h1>
      
      <div className="flex items-center gap-4 text-gray-500 mb-8">
        <span>{new Date(post.published_at).toLocaleDateString()}</span>
        <span>•</span>
        <span>{post.author}</span>
      </div>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
      )}

      <div className="text-gray-600 whitespace-pre-wrap">{post.content}</div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
        <div className="flex gap-2 flex-wrap">
          {post.meta_keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-ibiza-sand text-ibiza-night rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};