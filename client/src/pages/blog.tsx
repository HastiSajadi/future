import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { Offering } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Type for blog post with author
interface BlogPost extends Offering {
  author?: string;
}

export default function BlogPage() {
  // Fetch all blog posts (offerings)
  const { data: allPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return await response.json();
    },
  });

  // If we have no posts data yet, show skeleton loading state
  if (isLoading || !allPosts) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="aspect-video bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mt-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="aspect-video bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Split posts into featured (first post) and others
  const featuredPost = allPosts[0];
  const featuredSecondaryPosts = allPosts.slice(1, 4);
  const latestPosts = allPosts.slice(4);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Featured Posts Section */}
        <h2 className="text-2xl font-medium mb-8">Our Featured Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Main featured post (larger) */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <Link href={`/blog/${featuredPost.id}`}>
              <div className="bg-gray-300 aspect-[4/3] rounded-md"></div>
            </Link>
          </div>

          {/* Featured post text */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <Link href={`/blog/${featuredPost.id}`}>
              <h3 className="text-lg font-medium mb-2">{featuredPost.title}</h3>
            </Link>
            <p className="text-gray-600 mb-4 text-sm">{featuredPost.description}</p>
            <div className="flex items-center text-xs text-gray-500 mt-auto">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-xs">
                  O
                </div>
                <span>Oliver Bennett</span>
              </div>
              <span className="mx-1">•</span>
              <span>{formatDate(featuredPost.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Secondary featured posts (smaller) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {featuredSecondaryPosts.map((post) => (
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
                <h3 className="text-sm font-medium hover:underline">
                  {post.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        {/* Latest Posts Section */}
        <h2 className="text-2xl font-medium mb-8">Latest Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {latestPosts.slice(0, 6).map((post) => (
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
                <h3 className="text-sm font-medium hover:underline">
                  {post.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mb-8">
          <Button variant="outline" className="rounded-full px-8 text-sm bg-gray-800 text-white hover:bg-gray-700">
            Load More Blogs
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}