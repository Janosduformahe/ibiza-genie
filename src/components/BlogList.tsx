import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const BlogList = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-64">
            <CardContent className="h-full bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts?.map((post) => (
        <Link to={`/blog/${post.slug}`} key={post.id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl text-ibiza-night">{post.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.summary}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {post.meta_keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-ibiza-sand text-ibiza-night text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};