import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import ArticleType from '../../types/ArticleType';
import CategoryType from '../../types/CategoryType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import SingleArticlePreview from '../SingleArticlePreview/SingleArticlePreview';

interface CategoryPageProperties {

    match: {
        params: {
            cId: number;
        }
    }


}

interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
    filters:{
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order:"name asc" | "name desc"| "price asc"| "price desc";
        selectedFeatures: {
            featureId: number;
            value: string;
        }[];
    };
    features:{
        featureId : number;
        name: string;
        values: string[];
    }[];
}




interface CategoryDto{
    categoryId: number;
    name: string;
}

interface ArticleDto{
    articleId: number;
    name: string;
    excerpt: string;
    description: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;
    }[],


}

export default class CategoryPage extends React.Component <CategoryPageProperties>{
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = { 
            isUserLoggedIn: true,
            message: '',
            filters: {
                keywords: ' ',
                priceMinimum: 0.01,
                priceMaximum: 1000000000000,
                order: "price asc",
                selectedFeatures: [],
            },
            features: [],
        };
    }

    private setFeatures(features: any){
        const newState= Object.assign(this.state,{
            features: features,
        });
        this.setState(newState);
    }
    private setLoginState(isLoggedIn: boolean){
        const newState= Object.assign(this.state,{
            isLoggedIn: isLoggedIn,
        });
        this.setState(newState);
    }

    render() {
        
        if(this.state.isUserLoggedIn === false){
            return (
                <Redirect to="/user/login" />
            );
        }

        return(

            <Container>
                        <RoledMainMenu role="user" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt } /> {this.state.category?.name}
                        </Card.Title>
                        { this.printOptionalMessage() }
                        { this.showSubcategories() }
                        
                    </Card.Body>
                </Card>
              
            </Container>
        );
    }

    private printFeatureFilterCompontent(feature: {featureId: number; name: string; values:string[];}){
        return (
            <Form.Group>
                <Form.Label>{feature.name}</Form.Label>
                {values.map (value =>(
                    <Form.Check type="checkbox" label={ value } value= {value} 
                    data-featureId = {feature.featureId}
                    onChange= {(event) => this.featureFilterChanged(event as any)} />
                ))}
            </Form.Group>
        );
    }
   
    private printOptionalMessage(){
        if(this.state.message === ''){
            return;
        }
        return (
                        <Card.Text>
                            { this.state.message }
                        </Card.Text>
        );
    }

    private showSubcategories(){
        if(this.state.subcategories?.length == 0){
            return;
        }
        return (
            <Row>
            { this.state.subcategories?.map(this.singleCategory) }
            </Row>
        );

    }
    private singleCategory(category: CategoryType) {
        return (
          <Col md="4" lg="3" sm="6" xs="12">
              <Card>
                <Card.Body>
                  <Card.Title>
                    { category.name }
                  </Card.Title>
                  <Link to={ `/category/${category.categoryId}` }
                   className="btn btn-primary">
                     Open category
                   </Link>
                </Card.Body>
              </Card>
          </Col>
        );
      }

      private singleArticle(article: ArticleType){
          return(
            <SingleArticlePreview article={article} />
          );
      }

   

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties){
        if (oldProperties.match.params.cId === this.props.match.params.cId ){
            return; 
        }
        this.getCategoryData();
    }

    private getCategoryData(){
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if(res.status === 'login'){
               return  this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error. Please try to refresh...')
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);

            const subcategories: CategoryType[] = 
            res.data.categories.map((category: CategoryDto)   => {
                return {
                    categoryId: category.categoryId,
                    name: category.name,
                }

            });

            this.setSubcategories(subcategories);

            });
            const orderParts = this.state.filters.order.split(' ');
            const orderBy = orderParts[0];
            const orderDirection = orderParts[1].toUpperCase();
            const featureFilters: any[] = [ ];

            for (const item of this.state.filters.selectedFeatures){
                let found = false;
                let foundRef = null;
                for (const featureFilter of featureFilters){
                    if (featureFilter.featureId === item.featureId){
                        found = true;
                        foundRef = featureFilter;
                        break;
                    }  
                }

                if (!found){
                    featureFilters.push({
                        featureId: item.featureId,
                        values: [item.value],
                    });
                }
                    else{
                        foundRef.values.pus(item.value);
                    }

                }
            
            api('api/article/search/', 'post', {

                categoryId: this.props.match.params.cId,
                keywords: '',
                priceMin: 0,
                priceMax: Number.MAX_SAFE_INTEGER,
                features: [],
                orderBy: "price",
                orderDirection: "ASC",
            })
            .then((res: ApiResponse) => {
                if(res.status === 'login'){
                   return  this.setLogginState(false);
                }
    
                if(res.status === 'error'){
                    return this.setMessage('Request error. Please try to refresh...')
                }
    
                
                

        });
    }
    
    
    private setLogginState(isLoggedIn: boolean){
        const newState = Object.assign(this.state, {
          isUserLoggedIn: isLoggedIn,
        });
        this.setState(newState);
    }

    private setMessage(message: string){
        const newState = Object.assign(this.state, {
          message: message,
        });
        this.setState(newState);
    }

    private setCategoryData(category: CategoryType){
        const newState = Object.assign(this.state, {
          category: category,
        });
        this.setState(newState);
    }
    private featureFilterChanged(event: React.ChangeEvent<HTMLInputElement>){
        const featureId =Number( event.target.dataset.featureId);
        const value = event.target.value;

        if (event.target.checked){
            this.addFeatureFilterValue(featureId, value);
        }else{
            this.removeFeatureFilterValue(featureId, value);
        }
    }
    private addFeatureFilterValue(featureId: number, value:string){
        const newSelectedFeatures = [... this.state.filters.selectedFeatures];
        newSelectedFeatures.push({
            featureId: featureId,
            value: value,
        });
        this.setSelectedFeatures(newSelectedFeatures);
    }
    private removeFeatureFilterValue(featureId: number, value:string){
        const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record =>{
            return !(record.featureId == featureId && record.value === value); 
            });
       this.setSelectedFeatures(newSelectedFeatures);
    }

    private setSelectedFeatures(newSelectedFeatures: any){
        this.setState(Object.assign(this.state, {
            filters: Object.assign(this.state.filters,{
                selectedFeatures: newSelectedFeatures,
            })
        }));
    }
    private setSubcategories(subcategories: CategoryType[]){
        const newState = Object.assign(this.state, {
            subcategories: subcategories,
        });
        this.setState(newState);
        this.getFeatures();
    }
    getFeatures(){
        api('api/feature/values/' + this.props.match.params.cId, 'get', {})
        .then((res:ApiResponse) => {
            if (res.status === 'login'){
                return this.setLogginState(false);
            }
            if (res.status === 'error'){
                return this.setMessage('Request error. Please try to refresh the page.');
            }
            this.setFeatures(res.data.features);
        });
    }
}