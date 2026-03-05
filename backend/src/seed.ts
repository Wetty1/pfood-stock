import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const categoriesService = app.get(CategoriesService);
  const productsService = app.get(ProductsService);

  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuários
  console.log('👤 Criando usuários...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    await usersService.create({
      name: 'Administrador',
      email: 'admin@pfood.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });
    console.log('✅ Usuário ADMIN criado: admin@pfood.com / admin123');
  } catch (error) {
    console.log('⚠️  Usuário ADMIN já existe');
  }

  try {
    await usersService.create({
      name: 'Gerente',
      email: 'gerente@pfood.com',
      password: hashedPassword,
      role: UserRole.MANAGER,
      isActive: true,
    });
    console.log('✅ Usuário MANAGER criado: gerente@pfood.com / admin123');
  } catch (error) {
    console.log('⚠️  Usuário MANAGER já existe');
  }

  try {
    await usersService.create({
      name: 'Operador',
      email: 'operador@pfood.com',
      password: hashedPassword,
      role: UserRole.OPERATOR,
      isActive: true,
    });
    console.log('✅ Usuário OPERATOR criado: operador@pfood.com / admin123');
  } catch (error) {
    console.log('⚠️  Usuário OPERATOR já existe');
  }

  // Criar categorias
  console.log('\n📁 Criando categorias...');
  
  const categoriesData = [
    { name: 'Carnes', description: 'Produtos cárneos em geral' },
    { name: 'Vegetais', description: 'Verduras, legumes e hortaliças' },
    { name: 'Laticínios', description: 'Leite, queijos e derivados' },
    { name: 'Bebidas', description: 'Bebidas em geral' },
    { name: 'Temperos', description: 'Temperos e condimentos' },
    { name: 'Massas', description: 'Massas e farinhas' },
    { name: 'Grãos', description: 'Arroz, feijão e outros grãos' },
  ];

  const categories = [];
  for (const categoryData of categoriesData) {
    try {
      const category = await categoriesService.create(categoryData);
      categories.push(category);
      console.log(`✅ Categoria criada: ${category.name}`);
    } catch (error) {
      const existing = await categoriesService.findByName(categoryData.name);
      if (existing) {
        categories.push(existing);
        console.log(`⚠️  Categoria ${categoryData.name} já existe, usando existente`);
      }
    }
  }

  // Criar produtos
  console.log('\n📦 Criando produtos...');
  
  if (categories.length > 0) {
    const productsData = [
      {
        name: 'Filé de Frango',
        categoryId: categories[0].id,
        unit: 'kg',
        currentQuantity: 15.5,
        minQuantity: 5.0,
        unitPrice: 18.90,
        sku: 'FRG001',
        baseProduct: 'frango',
        brand: 'Sadia',
      },
      {
        name: 'Picanha',
        categoryId: categories[0].id,
        unit: 'kg',
        currentQuantity: 8.0,
        minQuantity: 3.0,
        unitPrice: 65.00,
        sku: 'CAR001',
        baseProduct: 'picanha',
        brand: 'Friboi',
      },
      {
        name: 'Alface',
        categoryId: categories[1].id,
        unit: 'unidades',
        currentQuantity: 25,
        minQuantity: 10,
        unitPrice: 2.50,
        sku: 'VEG001',
      },
      {
        name: 'Tomate',
        categoryId: categories[1].id,
        unit: 'kg',
        currentQuantity: 12.0,
        minQuantity: 5.0,
        unitPrice: 4.50,
        sku: 'VEG002',
      },
      {
        name: 'Queijo Mussarela',
        categoryId: categories[2].id,
        unit: 'kg',
        currentQuantity: 6.5,
        minQuantity: 3.0,
        unitPrice: 35.00,
        sku: 'LAT001',
      },
      {
        name: 'Leite Integral',
        categoryId: categories[2].id,
        unit: 'litros',
        currentQuantity: 20.0,
        minQuantity: 10.0,
        unitPrice: 4.80,
        sku: 'LAT002',
      },
      {
        name: 'Refrigerante Cola',
        categoryId: categories[3].id,
        unit: 'litros',
        currentQuantity: 30.0,
        minQuantity: 15.0,
        unitPrice: 6.50,
        sku: 'BEB001',
      },
      {
        name: 'Sal',
        categoryId: categories[4].id,
        unit: 'kg',
        currentQuantity: 5.0,
        minQuantity: 2.0,
        unitPrice: 2.00,
        sku: 'TMP001',
      },
      {
        name: 'Macarrão Espaguete',
        categoryId: categories[5].id,
        unit: 'kg',
        currentQuantity: 10.0,
        minQuantity: 5.0,
        unitPrice: 8.50,
        sku: 'MAS001',
      },
      {
        name: 'Arroz Branco Marca A',
        categoryId: categories[6].id,
        unit: 'kg',
        currentQuantity: 9.0,
        minQuantity: 20.0,
        unitPrice: 5.50,
        sku: 'GRA001',
        baseProduct: 'arroz',
        brand: 'Tio João',
      },
      {
        name: 'Arroz Branco Marca B',
        categoryId: categories[6].id,
        unit: 'kg',
        currentQuantity: 9.0,
        minQuantity: 20.0,
        unitPrice: 5.20,
        sku: 'GRA001B',
        baseProduct: 'arroz',
        brand: 'Camil',
      },
      {
        name: 'Feijão Preto',
        categoryId: categories[6].id,
        unit: 'kg',
        currentQuantity: 25.0,
        minQuantity: 10.0,
        unitPrice: 7.80,
        sku: 'GRA002',
        baseProduct: 'feijao',
        brand: 'Kicaldo',
      },
    ];

    for (const productData of productsData) {
      try {
        const product = await productsService.create(productData);
        console.log(`✅ Produto criado: ${product.name}`);
      } catch (error) {
        console.log(`⚠️  Produto ${productData.name} já existe ou erro ao criar`);
      }
    }
  }

  console.log('\n✨ Seed concluído com sucesso!');
  console.log('\n📝 Credenciais de acesso:');
  console.log('   ADMIN:    admin@pfood.com / admin123');
  console.log('   MANAGER:  gerente@pfood.com / admin123');
  console.log('   OPERATOR: operador@pfood.com / admin123');
  
  await app.close();
}

seed()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  });