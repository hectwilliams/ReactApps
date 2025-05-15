import React, {Component} from 'react';
import axios from 'axios';
import cl from './Movies.css';
import star from './star_icon.png';
import jeep from './jeep.jpeg';
import projector from './projector.png';
import rotten from './rotten.png';
import imdb from './imdb.png';
import people from './people.png';
import ink from './ink.png';
import starz from './star.png';
import director from './director.png';


class Movies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s : "https://resizing.flixster.com/y9UXYzTereQspspK6MKU1tJdMLA=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p28278_p_v12_aj.jpg",
            modalState: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (event) {
        console.log('hello world');
        this.setState({modalState: !this.state.modalState});
    }

    render() {
        return (
            <> 
                {
                    this.state.modalState? 
                    <>
                        <div className={cl.cover_screen }></div>
                        <MoviesModal exitModel={this.handleClick}/> 
                    </>
                    : ''
                }

            <div className={cl.row_container}>

                <div className={cl.container}>

                <div className={cl.movie_entry_container}>
                {

                    Array(4).fill(0).map(()=>{
                        
                        return (

                                <div onClick={this.handleClick} className={cl.movie_container}>
                                    
                                    <div className={cl.hover2}> </div> 

                                    <div className={cl.movie_entry_genre}> 
                                        <p>  Horror  </p>
                                    </div>  

                                    <div className={cl.movie_entry_pic}> 
                                        <img src={this.state.s} />
                                    </div>
                                    <div className={cl.hover}> 
                                        <p>  Jeepers Creepers </p>
                                    </div> 

                                    <div className={cl.placeholder}> 
                                    </div>

                                </div>
                            
                        )
                    })}
                </div>


       <div className={cl.movie_entry_container}>
                {

                    Array(4).fill(0).map(()=>{
                        
                        return (


                                <div className={cl.movie_container}>
                                    
                                <div className={cl.hover2}> 
                                    </div> 

                                    
                                    {/* <div className={cl.movie_entry_star}> 
                                        {/* <img src={star} /> */}
                                    {/* </div>  */}

                                    <div className={cl.movie_entry_genre}> 
                                        <p>  Horror  </p>
                                    </div>  

                                    <div className={cl.movie_entry_pic}> 
                                        <img src={this.state.s} />
                                    </div>
                                    <div className={cl.hover}> 
                                        <p>  Jeepers Creepers </p>
                                    </div> 

                                    <div className={cl.placeholder}> 
                                    </div>

                                </div>
                            
                        )
                    })}
                </div>





       <div className={cl.movie_entry_container}>
                {

                    Array(4).fill(0).map(()=>{
                        
                        return (

                                <div className={cl.movie_container}>
                                    
                                <div className={cl.hover2}> </div> 
                                    
                                    <div className={cl.movie_entry_genre}> 
                                        <p>  Horror  </p>
                                    </div>  

                                    <div className={cl.movie_entry_pic}> 
                                        <img src={this.state.s} />
                                    </div>

                                    <div className={cl.hover}> 
                                        <p>  Jeepers Creepers </p>
                                    </div> 

                                    <div className={cl.placeholder}> </div>

                                </div>
                            
                        )
                    })}
                </div>

                </div>
            </div>
            
            </>

        )
    }
}

class MoviesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (

            <div className={cl.modal_container}>

                <div className={cl.modal_left}>
                    <div onClick={this.props.exitModel} className={cl.closeit}> x </div>
                    <img src={jeep}/>
                </div>


                <div className={cl.modal_right}>
                        
                    <div className={cl.modal_genre}>
                        <img src={projector}/>

                        <div >
                            <p>Horror</p>
                        </div>
                    </div>


                    <div className={cl.modal_rating}>

                        <img src={star}/>

                        <div >

                            <div>
                                <div className={cl.rating_img_container}>
                                    <img src={rotten}/>
                                </div>

                                <div>
                                    <p> 4.6/10</p> 
                                </div>
                            </div>


                            <div>
                                <div className={cl.rating_img_container}>
                                    <img src={imdb}/>
                                </div>

                                <div>
                                    <p> 9/10</p> 
                                </div>
                            </div>
                            
                     
                        </div>

                    </div>

                    <div className={cl.modal_team}>

                        <div>
                            <img src={people}/>
                        </div>

                        <div className={cl.teamlist}>
                            <div>
                                < div> <img src={director}/> </div>
                                <div><p>Static Shock</p></div>
                            </div>

                            <div>
                                < div> <img src={ink}/> </div>
                                <div><p>Storm</p></div>
                            </div>

                            
                        </div>

                    </div>

                </div>

            </div>

        )
    }
}


export default Movies;