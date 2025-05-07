import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { Offering } from "@shared/schema";
import { formatDate } from "@/lib/utils";

// Type for blog post with author
interface BlogPost extends Offering {
  author?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id;

  // Fetch blog post details
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      return await response.json();
    },
    enabled: !!postId,
  });

  // Fetch suggested posts
  const { data: suggestedPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/suggested"],
    queryFn: async () => {
      const response = await fetch(`/api/blog/suggested`);
      if (!response.ok) {
        throw new Error("Failed to fetch suggested posts");
      }
      return await response.json();
    },
  });

  if (isLoading || !post) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Featured Image */}
        <div className="bg-gray-300 aspect-[16/9] rounded-lg mb-6 max-w-4xl mx-auto"></div>

        {/* Blog Post Content */}
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-medium mb-2">{post.title}</h1>
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-xs">
                  O
                </div>
                <span>Oliver Bennett</span>
              </div>
              <span className="mx-1">•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-sm max-w-none mb-16">
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            {/* Two column images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="aspect-square bg-gray-300 rounded-md"></div>
              <div className="aspect-square bg-gray-300 rounded-md"></div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            
            <h2 className="text-xl font-medium my-4">Lorem Ipsum Heading</h2>
            
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Suggested Posts */}
          {suggestedPosts && suggestedPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-medium mb-6">Suggested Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="col-span-1">
                    <Link href={`/blog/${post.id}`}>
                      <div className="bg-gray-300 aspect-[4/3] rounded-md mb-3"></div>
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-xs">
                          O
                        </div>
                        <span>Oliver Bennett</span>
                      </div>
                      <span className="mx-1">•</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <h3 className="text-sm font-medium hover:underline">{post.title}</h3>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}