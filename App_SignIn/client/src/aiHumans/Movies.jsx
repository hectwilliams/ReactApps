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
            info :{movieCount:0, rowArrayCount: []}
        }
    }

    componentDidMount() {
        axios({method:'get', url: window.origin + '/' + 'aihumans' + '?req=movies' })
        .then((response)=>{
            let data = JSON.parse(response.data); 
            let num_rows = Math.ceil(data.movies.length/4);
            let num_movies = data.movies.length;
            let row_array_count = [...Array(num_rows).keys()]
            this.setState({pageRef: data.menuItems, info: {movieCount: num_movies, rowArrayCount: row_array_count, movies: data.movies}})
        });
    }


    render() {
        return (
            <> 

            <div className={cl.row_container}>

                <div className={cl.container}>
                    {
                        this.state.info.rowArrayCount.map( (index) => { return (<MovieBlockEntry index={index} movies={this.state.info.movies} currentRow={index} numMovies={this.state.info.movieCount}   lastRow= {index == this.state.info.rowArrayCount.length-1 }   />)})
                    }
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

            <>

            <p onClick={this.props.closeModal} className={cl.closeit}></p>
            <div className={cl.modal_container}>

                <div className={cl.modal_left}>
                    <img src= { JSON.parse(this.props.record).poster } />
                </div>


                <div className={cl.modal_right}>
                        
                    <div className={cl.modal_genre}>
                        <img src={projector}/>
                        <div >
                            <p> {JSON.parse(this.props.record).genre}  </p>
                        </div>
                    </div>

                    <div className={cl.modal_rating}>

                        <img src={star}/>

                        <div >

                            <div>
                                <div name="rotten_score" className= {cl.rating_img_container}   >
                                    
                                    <img  className={cl.rating_img} src={rotten}/>
                                </div>

                                <div>
                                    <p>  {JSON.parse(this.props.record).tomatometer}    </p> 
                                </div>
                            </div>

                            <div>
                                <div name="imdb_score" className={cl.rating_img_container}>
                                    <img  className={cl.rating_img} src={imdb}/>
                                </div>

                                <div>
                                    <p> {JSON.parse(this.props.record)["imdb-rating"] }   </p> 
                                </div>
                            </div>
                     
                        </div>

                    </div>

                    <div className={cl.modal_team}>

                        <div className={cl.teamIcon}>
                            <img src={people}/>
                        </div>

                        <div className={cl.teamlist}>
                            <div className={cl.teamlist_sub}>


                                            {
                                <>

                                        {   
                                            JSON.parse(this.props.record).members.Director.map((name) => { 
                                                return (
                                                    <div className={cl.ele_container}>
                                                        < div> <img src={director}/> </div>
                                                         <div className={cl.name_container1}>
                                                            <div className={cl.name_container2}>
                                                                <p> 
                                                                    {name}
                                                                </p>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                         {   
                                            JSON.parse(this.props.record).members.Writer.map((name) => { 
                                               return  (
                                                    <div className={cl.ele_container} >
                                                        < div> <img src={ink}/> </div>
                                                         <div className={cl.name_container1}>
                                                            <div className={cl.name_container2}>
                                                                <p> 
                                                                    {name}
                                                                </p>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                        {   
                                            JSON.parse(this.props.record).members.Stars.concat(JSON.parse(this.props.record).members.Stars).concat(JSON.parse(this.props.record).members.Stars).concat(JSON.parse(this.props.record).members.Stars).concat(JSON.parse(this.props.record).members.Stars).concat(JSON.parse(this.props.record).members.Stars).concat(JSON.parse(this.props.record).members.Stars).map((name) => { 
                                            // Array.from(Array(20).keys()).map((name) => { 

                                               return  (
                                                    <div className={cl.ele_container} >
                                                        < div> <img src={starz}/> </div>
                                                        <div  className={cl.name_container1}>
                                                         
                                                            <div name_gt={ (name.length > 36 ).toString() } className={cl.name_container2}>
                                                                   
                                                                <p name={name} >{name} </p>
                                                                
                                                            </div> 
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        } 


                                </>
                            } 
                            </div>

                            
                        </div>

                    </div>

                </div>

            </div>

            </>

        )
    }
}


class MovieBlockEntry extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <>

                <div className={cl.movie_entry_container}>
                    {
                        this.props.movies.slice(4 * this.props.currentRow, 4 * (this.props.currentRow+1)).map( (movieRecord) => {return (
                            <>
                                <Movie record= {JSON.stringify(movieRecord) } />
                                {
                                    /* fills open slots with placeholder */
                                    this.props.lastRow==true ? 
                                        [ ...Array( 4 - (this.props.numMovies % 4) ).keys() ].map( () => {  return (  <Movie record={JSON.stringify({})} />  ) } ) 
                                    : 
                                        ''
                                }             
                            </>
                        )})

                    }
                        
                </div>
            </>
        )
    }

}


class Movie extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            modalState: false
        }
    }

    handleClick (event) {
        this.setState({modalState: !this.state.modalState});
    }

    closeModal(event) {
        this.setState({modalState: false});
    }

    render() {
        return (
            <>

                {
                    this.state.modalState? 
                        <>
                            <div onClick={this.closeModal} className={cl.cover_screen }></div>
                            <MoviesModal record={ (this.props.record)   } closeModal={this.closeModal}  exitModel={this.handleClick}/> 
                        </>
                        : ''
                }
                
                <div onClick={this.handleClick} className={cl.movie_container} data-keys={Object.keys( JSON.parse(this.props.record)).length}>

                    <div className={cl.hover2}> </div> 

                    <div className={cl.movie_entry_genre}> 
                        {
                            JSON.parse(this.props.record).hasOwnProperty("genre") ?  ( <p>  {JSON.parse(this.props.record).genre} </p>  )   : ''
                        }
                    </div>  

                    <div className={cl.movie_entry_pic}> 
                        {

                            JSON.parse(this.props.record).hasOwnProperty("poster") ? <img src= {JSON.parse(this.props.record).poster} /> : ''
                        }
                        
                    </div>

                    <div className={cl.hover}> 
                        {
                            JSON.parse(this.props.record).hasOwnProperty("name") ?  <p> {JSON.parse(this.props.record).name}  </p> : ''
                        }    

                    </div> 

                    <div className={cl.placeholder}> </div>

                </div>
            </>
        )
    }

}

export default Movies;





