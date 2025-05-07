import { db } from "./index";
import { products, categories, offerings } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    // Check if categories exist (for products seeding)
    const existingCategories = await db.query.categories.findMany();
    const shouldSeedCategoriesAndProducts = existingCategories.length === 0;
    
    // Will seed blog posts regardless of existing data
    const existingOfferings = await db.query.offerings.findMany();
    console.log(`Found ${existingOfferings.length} existing blog posts`);

    // Seed categories
    const categoryData = [
      {
        name: "Living Room",
        description: "Transform your living room with our stylish and comfortable furniture.",
        imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      },
      {
        name: "Bedroom",
        description: "Create a peaceful bedroom sanctuary with our quality furniture.",
        imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
      },
      {
        name: "Kitchen",
        description: "Upgrade your kitchen with our modern and functional designs.",
        imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900"
      },
      {
        name: "Home Office",
        description: "Work from home in style with our ergonomic office furniture.",
        imageUrl: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
      }
    ];

    let categoryMap: Record<string, number> = {};
    
    if (shouldSeedCategoriesAndProducts) {
      const insertedCategories = await db.insert(categories).values(categoryData).returning();
      console.log("Categories seeded:", insertedCategories.length);
      
      // Map category ids for referencing
      categoryMap = insertedCategories.reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {} as Record<string, number>);
    } else {
      // If categories already exist, build the category map from existing data
      const allCategories = await db.query.categories.findMany();
      categoryMap = allCategories.reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {} as Record<string, number>);
      
      console.log("Categories already exist, using existing category IDs");
    }

    // Seed products only if needed
    if (shouldSeedCategoriesAndProducts) {
      const productData = [
      // Featured products
      {
        name: "Harmony Kona Table",
        description: "A modern minimalist coffee table perfect for any living room.",
        price: "149",
        compareAtPrice: "199",
        imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "SALE",
        categoryId: categoryMap["Living Room"],
        isFeatured: true
      },
      {
        name: "Cosmo Soft Sofa",
        description: "A contemporary couch in light gray, offering both style and comfort.",
        price: "899",
        imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "NEW",
        categoryId: categoryMap["Living Room"],
        isFeatured: true
      },
      {
        name: "Ambient Desk Lamp",
        description: "A minimalist desk lamp providing perfect lighting for your workspace.",
        price: "79",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        categoryId: categoryMap["Home Office"],
        isFeatured: true
      },
      {
        name: "Plush Throw Pillow",
        description: "A decorative throw pillow to add comfort and style to your living space.",
        price: "39",
        imageUrl: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "BESTSELLER",
        categoryId: categoryMap["Living Room"],
        isFeatured: true
      },
      
      // Popular products
      {
        name: "Nordic Wood Chair",
        description: "A minimalist wooden chair with Scandinavian design influence.",
        price: "129",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "BESTSELLER",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Milano Coffee Table",
        description: "A modern coffee table with elegant design and practical functionality.",
        price: "349",
        compareAtPrice: "429",
        imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "SALE",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Halo Pendant Light",
        description: "A minimalist pendant lamp that adds a touch of elegance to any room.",
        price: "189",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Ceramic Vase Set",
        description: "A decorative vase set that adds character to your interior design.",
        price: "69",
        imageUrl: "https://images.pixabay.com/photo/2020/08/27/07/31/vase-5521767_1280.jpg",
        badge: "NEW",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Modular Bookshelf",
        description: "A modern bookshelf with a customizable design to fit your space.",
        price: "299",
        imageUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Wool Throw Blanket",
        description: "A cozy throw blanket perfect for adding warmth and style to your couch.",
        price: "89",
        imageUrl: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "BESTSELLER",
        categoryId: categoryMap["Bedroom"],
        isPopular: true
      },
      {
        name: "Minimalist Wall Clock",
        description: "A minimalist wall clock that complements your modern home decor.",
        price: "59",
        imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      },
      {
        name: "Arch Floor Lamp",
        description: "A stylish floor lamp with an arched design to illuminate your space.",
        price: "149",
        compareAtPrice: "199",
        imageUrl: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        badge: "SALE",
        categoryId: categoryMap["Living Room"],
        isPopular: true
      }
    ];

      const insertedProducts = await db.insert(products).values(productData).returning();
      console.log("Products seeded:", insertedProducts.length);
    } else {
      console.log("Products already exist, skipping product seed");
    }

    // Remove existing offerings if any (to avoid duplicates)
    if (existingOfferings.length > 0) {
      await db.delete(offerings);
      console.log("Deleted existing offerings to avoid duplicates");
    }

    // Seed offerings/blog posts
    const offeringData = [
      {
        title: "How to Create a Modern Minimalist Interior",
        description: "Learn the principles of minimalist design and how to apply them to create a serene and functional living space.",
        imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-09-12")
      },
      {
        title: "Using Color Psychology in Home Decor",
        description: "Discover how different colors can affect mood and energy in your spaces, and tips for creating the perfect color palette.",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-09-05")
      },
      {
        title: "Smart Storage Solutions for Small Spaces",
        description: "Maximize your living area with these clever storage ideas that combine functionality with style.",
        imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-08-28")
      },
      {
        title: "Sustainable Furniture: Eco-Friendly Choices for Your Home",
        description: "Explore eco-friendly furniture options and learn how sustainable choices can create beautiful, environmentally responsible living spaces.",
        imageUrl: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-08-21")
      },
      {
        title: "Scandinavian Design: Clean Lines and Natural Elements",
        description: "Discover the core principles of Scandinavian interior design and how to bring this popular aesthetic into your home.",
        imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-08-14")
      },
      {
        title: "Choosing the Perfect Sofa for Your Living Room",
        description: "Factors to consider when selecting a sofa that balances comfort, style, and durability for your specific space.",
        imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-08-07")
      },
      {
        title: "Home Office Design: Creating a Productive Workspace",
        description: "Tips for designing a home office that enhances focus and productivity while complementing your home's aesthetic.",
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-07-31")
      },
      {
        title: "Mixing Vintage and Modern Furniture",
        description: "Learn how to seamlessly blend vintage pieces with contemporary furniture for a unique and personalized home style.",
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-07-24")
      },
      {
        title: "Lighting Design: How to Transform Your Space with Light",
        description: "Understand the principles of lighting design and how different types of lighting can enhance the mood and functionality of any room.",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date("2023-07-17")
      }
    ];

    const insertedOfferings = await db.insert(offerings).values(offeringData).returning();
    console.log("Offerings seeded:", insertedOfferings.length);

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
