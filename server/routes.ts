import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { products, categories, offerings } from "@shared/schema";
import { eq, and, or, like, between, sql, desc, asc, isNull } from "drizzle-orm";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes
  const apiPrefix = "/api";
  
  // Get featured products
  app.get(`${apiPrefix}/products/featured`, async (req, res) => {
    try {
      const featuredProducts = await db.query.products.findMany({
        where: eq(products.isFeatured, true),
        with: {
          category: true
        }
      });
      
      return res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  // Get popular products
  app.get(`${apiPrefix}/products/popular`, async (req, res) => {
    try {
      const popularProducts = await db.query.products.findMany({
        where: eq(products.isPopular, true),
        with: {
          category: true
        }
      });
      
      return res.json(popularProducts);
    } catch (error) {
      console.error("Error fetching popular products:", error);
      return res.status(500).json({ error: "Failed to fetch popular products" });
    }
  });

  // Get all categories
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const allCategories = await db.query.categories.findMany();
      return res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get offerings/blog posts
  app.get(`${apiPrefix}/offerings`, async (req, res) => {
    try {
      const latestOfferings = await db.query.offerings.findMany({
        orderBy: (offerings, { desc }) => [desc(offerings.createdAt)],
        limit: 3
      });
      
      return res.json(latestOfferings);
    } catch (error) {
      console.error("Error fetching offerings:", error);
      return res.status(500).json({ error: "Failed to fetch offerings" });
    }
  });
  
  // Blog endpoints
  
  // Get all blog posts
  app.get(`${apiPrefix}/blog/posts`, async (req, res) => {
    try {
      const allPosts = await db.query.offerings.findMany({
        orderBy: (offerings, { desc }) => [desc(offerings.createdAt)]
      });
      
      return res.json(allPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  // Get a single blog post by ID
  app.get(`${apiPrefix}/blog/posts/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      const post = await db.query.offerings.findFirst({
        where: eq(offerings.id, postId)
      });
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  // Get suggested blog posts
  app.get(`${apiPrefix}/blog/suggested`, async (req, res) => {
    try {
      const suggestedPosts = await db.query.offerings.findMany({
        orderBy: (offerings, { desc }) => [desc(offerings.createdAt)],
        limit: 3
      });
      
      return res.json(suggestedPosts);
    } catch (error) {
      console.error("Error fetching suggested posts:", error);
      return res.status(500).json({ error: "Failed to fetch suggested posts" });
    }
  });
  
  // Get related blog posts by post ID
  app.get(`${apiPrefix}/blog/related/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      // Get related posts (in a real app, you might use tags or categories)
      const relatedPosts = await db.query.offerings.findMany({
        where: sql`${offerings.id} != ${postId}`,
        orderBy: (offerings, { desc }) => [desc(offerings.createdAt)],
        limit: 3
      });
      
      return res.json(relatedPosts);
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return res.status(500).json({ error: "Failed to fetch related posts" });
    }
  });
  
  // Get single product details by ID
  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
          category: true
        }
      });
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      return res.json(product);
    } catch (error) {
      console.error("Error fetching product details:", error);
      return res.status(500).json({ error: "Failed to fetch product details" });
    }
  });
  
  // Add a product search endpoint
  app.get(`${apiPrefix}/products/search`, async (req, res) => {
    try {
      const { q, category, minPrice, maxPrice, sort, page = '1', limit = '12' } = req.query;
      
      const currentPage = parseInt(page as string) || 1;
      const itemsPerPage = parseInt(limit as string) || 12;
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Build the query conditions
      let conditions = [] as any[];
      
      // Search by name or description
      if (q) {
        conditions.push(
          or(
            like(products.name, `%${q}%`),
            like(products.description, `%${q}%`)
          )
        );
      }
      
      // Filter by category
      if (category && category !== 'all') {
        const categoryId = parseInt(category as string);
        if (!isNaN(categoryId)) {
          conditions.push(eq(products.categoryId, categoryId));
        }
      }
      
      // Filter by price range
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice as string);
        const max = parseFloat(maxPrice as string);
        
        if (!isNaN(min) && !isNaN(max)) {
          conditions.push(
            and(
              sql`${products.price} >= ${min}`,
              sql`${products.price} <= ${max}`
            )
          );
        }
      }
      
      // Final where clause
      const whereClause = conditions.length > 0 
        ? and(...conditions)
        : undefined;
      
      // Determine sort order
      let orderBy;
      switch(sort) {
        case 'price_asc':
          orderBy = asc(products.price);
          break;
        case 'price_desc':
          orderBy = desc(products.price);
          break;
        case 'name_asc':
          orderBy = asc(products.name);
          break;
        case 'name_desc':
          orderBy = desc(products.name);
          break;
        case 'newest':
        default:
          orderBy = desc(products.createdAt);
      }
      
      // Get total count for pagination
      const countResult = await db
        .select({ count: sql`count(*)` })
        .from(products)
        .where(whereClause);
      
      const total = Number(countResult[0].count);
      
      // Get filtered products
      const filteredProducts = await db.query.products.findMany({
        where: whereClause,
        orderBy: orderBy,
        limit: itemsPerPage,
        offset,
        with: {
          category: true
        }
      });
      
      // Return products with pagination info
      return res.json({
        products: filteredProducts,
        pagination: {
          total,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(total / itemsPerPage)
        }
      });
    } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ error: "Failed to search products" });
    }
  });
  
  // Get related products
  app.get(`${apiPrefix}/products/related/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      // First, get the product to determine its category
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      });
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Find related products based on category or other criteria
      let relatedProducts;
      
      if (product.categoryId) {
        // If product has a category, find products in the same category
        relatedProducts = await db.query.products.findMany({
          where: and(
            eq(products.categoryId, product.categoryId),
            sql`${products.id} != ${productId}`
          ),
          limit: 4,
          with: {
            category: true
          }
        });
      }
      
      // If no related products by category, or not enough, get random products
      if (!relatedProducts || relatedProducts.length < 4) {
        const limit = relatedProducts ? 4 - relatedProducts.length : 4;
        
        const additionalProducts = await db.query.products.findMany({
          where: sql`${products.id} != ${productId}`,
          limit: limit,
          with: {
            category: true
          }
        });
        
        relatedProducts = relatedProducts 
          ? [...relatedProducts, ...additionalProducts]
          : additionalProducts;
      }
      
      return res.json(relatedProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
      return res.status(500).json({ error: "Failed to fetch related products" });
    }
  });

  // Newsletter subscription
  app.post(`${apiPrefix}/newsletter/subscribe`, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // In a real application, you would store this email in the database
      // and possibly integrate with an email marketing service
      
      return res.status(200).json({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });
  
  // Contact form submission
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const { name, email, phone, subject, inquiryType, country, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message || !inquiryType) {
        return res.status(400).json({ 
          error: "Required fields are missing" 
        });
      }
      
      // In a real application, you would:
      // 1. Store this message in a database
      // 2. Send notification emails to admin/staff
      // 3. Possibly integrate with a CRM system
      console.log("Contact form submission:", {
        name,
        email,
        phone,
        subject,
        inquiryType,
        country,
        message
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Your message has been received. We'll get back to you soon." 
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({ 
        error: "An error occurred while processing your message. Please try again later." 
      });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
