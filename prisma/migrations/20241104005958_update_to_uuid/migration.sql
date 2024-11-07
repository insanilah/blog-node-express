/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `roles` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "fkh4c7lvsc298whoyd4w9ta25cr";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "fkn2na60ukhs76ibtpt9burkm27";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "fknvx9seeqqyy71bij291pwiwrg";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "fkry8tnr4x2vwemv2bb0h5hyl0x";

-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "fkb4lve46iv2mn28s6sflk8iksn";

-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "fkejkd5tjmy9c8yiulv59wp9ai4";

-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "fkkifam22p4s1nm3bkmp1igcn5w";

-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "fkm6cfovkyqvu5rlm6ahdx3eavj";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "fk6xvn0811tkyo3nfjk2xvqx6ns";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fkp56c1712k691lhsyewcssf40f";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "author_id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "likes_id_seq";

-- AlterTable
ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_pkey",
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_categories_pkey" PRIMARY KEY ("post_id", "category_id");

-- AlterTable
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_pkey",
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "tag_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id", "tag_id");

-- AlterTable
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "author_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_id_seq";

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "role_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tags_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "role_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fkh4c7lvsc298whoyd4w9ta25cr" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fkn2na60ukhs76ibtpt9burkm27" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fknvx9seeqqyy71bij291pwiwrg" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fkry8tnr4x2vwemv2bb0h5hyl0x" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_categories" ADD CONSTRAINT "fkb4lve46iv2mn28s6sflk8iksn" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_categories" ADD CONSTRAINT "fkejkd5tjmy9c8yiulv59wp9ai4" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "fkkifam22p4s1nm3bkmp1igcn5w" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "fkm6cfovkyqvu5rlm6ahdx3eavj" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk6xvn0811tkyo3nfjk2xvqx6ns" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fkp56c1712k691lhsyewcssf40f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
