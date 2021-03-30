export default interface ApiCategoryDto{
    categoryId: number;
    name: string;
    parentCategoryId: number | null;
    imagePath: string;
}