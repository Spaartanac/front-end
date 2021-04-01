import { faBoxOpen, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { features } from 'process';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from '../../config/api.config';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import AddToCartInput from '../AddToCartInput/AddToCartInput';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface ArticlePageProperties{
    match: {
        params: {
            aId: number;
        }
    }
}
interface FeatureData{
    name: string;
    value: string;
}

interface ArticlePageState{
    isUserLoggedIn: boolean;
    message: string;
    article?: ApiArticleDto;
    features: FeatureData[];

}



export default class ArticlePage extends React.Component<ArticlePageProperties>{

    state: ArticlePageState;

    constructor(props: Readonly<ArticlePageProperties>) {
        super(props);

        this.state= {
            isUserLoggedIn: true,
            message: '',
            features: [],
        }

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

    private setArticleData(articleData: ApiArticleDto | undefined){
        const newState = Object.assign(this.state, {
          article: articleData,
        });
        this.setState(newState);
    }

    private setFeatureData(featureData: FeatureData[]){
        const newState = Object.assign(this.state, {
          features: featureData,
        });
        this.setState(newState);
    }

    componentDidMount() {
        this.getArticleData();
    }

    componentDidUpdate(oldProperties: ArticlePageProperties){
        if (oldProperties.match.params.aId === this.props.match.params.aId ){
            return; 
        }
        this.getArticleData();
    }

    private getArticleData(){
        api('api/article/' + this.props.match.params.aId, 'get', {})
        .then((res: ApiResponse) => {
            if(res.status === 'login'){
               return  this.setLogginState(false);
            }

            if(res.status === 'error'){
                this.setMessage('This article doesnt exist..');
                this.setArticleData(undefined);
                this.setFeatureData([]);
                return;

            }   
            
            const data: ApiArticleDto = res.data;
            this.setArticleData(data);
            this.setMessage('');
            const features: FeatureData[] = [];

            for(const articleFeature of data.articleFeatures){
                const value = articleFeature.value;
                let name = '';
                for(const feature of data.features){
                    if(feature.featureId===articleFeature.featureId){
                        name = feature.name;
                        break;
                    }
                }
                features.push({name, value});
            }

            this.setFeatureData(features);


        });
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
                    <FontAwesomeIcon icon={ faBoxOpen } /> {this.state.article?.name}
                    </Card.Title>
                    { this.printOptionalMessage() }

                    <Row>
                        <Col xs="12" lg="8">
                            <div className="excerpt">
                                    {this.state.article?.excerpt}
                            </div>
                            <hr/>
                            <div className="description">
                                    {this.state.article?.description}
                            </div>
                            <hr/>

                            <b>Features:</b><br />

                            <ul>
                                {this.state.features.map(feature =>(
                                    <li>
                                    {feature.name}:{feature.value}
                                    </li>
                                ),this)}
                            </ul>
                        </Col>
                        <Col xs="12" lg="4">
                                <Row>
                                    <Col xs="12">
                                        <img alt={'Image - ' + this.state.article?.photos[0].photoId}
                                        src={ApiConfig.PHOTO_PATH + 'small/' + this.state.article?.photos[0].imagePath}
                                        className="w-100" /> 
                                    </Col>
                                </Row>
                                <Row>
                                    {this.state.article?.photos.slice(1).map(photo => (
                                        <Col xs="12" sm="6">
                                        <img alt={'Image - ' + this.state.article?.photos[0].photoId}
                                        src={ApiConfig.PHOTO_PATH + 'small/' + this.state.article?.photos[0].imagePath}
                                        className="w-100" /> 
                                    </Col> 
                                    ), this)}
                                </Row>
                                <Row>
                                    <Col xs="12" className="text-center mt-3 mb-3">
                                        <b>
                                        Price: {
                                            Number(this.state.article?.articlePrices[this.state.article?.articlePrices.length-1].price.toFixed(2)) + 'EUR'
                                        }
                                        </b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" className="text-center mt-3">
                                        {
                                            this.state.article 
                                            ? (<AddToCartInput article={this.state.article} /> ) 
                                            : ''
                                        }

                                    </Col>
                                </Row>
                        </Col>
                    </Row>
                    </Card.Body>
                    </Card>
                    </Container>
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



}