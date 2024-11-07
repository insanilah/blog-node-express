-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "fkb4lve46iv2mn28s6sflk8iksn";

-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "fkejkd5tjmy9c8yiulv59wp9ai4";

-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "fkkifam22p4s1nm3bkmp1igcn5w";

-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "fkm6cfovkyqvu5rlm6ahdx3eavj";

-- AddForeignKey
ALTER TABLE "post_categories" ADD CONSTRAINT "fkb4lve46iv2mn28s6sflk8iksn" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_categories" ADD CONSTRAINT "fkejkd5tjmy9c8yiulv59wp9ai4" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "fkkifam22p4s1nm3bkmp1igcn5w" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "fkm6cfovkyqvu5rlm6ahdx3eavj" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
