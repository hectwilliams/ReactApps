import React, {Component} from "react";
import cl from './PersonNotExist.css';
import axios from 'axios';
import dog from './dog.jpg';
import youtube from './youtube.png';
import casestudy from './casestudy.png';
import next from './next.png';

class PersonNotExist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageURL: dog,
            err: false,
            image: dog,
            loading: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        personsReq(this)
    }
    
    handleClick(event) {

        let name = event.currentTarget.parentNode.getAttribute('name')

        if ('research' == name)
            window.location.href = "https://arxiv.org/abs/1710.10196";
        else if ('youtube' == name)
            window.location.href = "https://youtu.be/G06dEcZ-QTg?si=MWY2LprXlSZguSq3";
        else 
            personsReq(this)
    }

    render() {
        return (
            <>

            {
                this.state.loading ?
                    
                    <LoadingPage />:
                
                    <div className={cl.container}>
                        <div className={cl.menu}> 
                            <div className={cl.menu_items_container} >

                                <div className={`${cl.item_block}`}>
                                    <p >{'Next'} </p>
                                    <div name={'next'} >
                                        <img  onClick={this.handleClick}  className={cl.menu_items} src={next}/>
                                    </div>
                                </div>

                                <div className={cl.item_block }>
                                    <p >{'Youtube'} </p>
                                    <div name={'youtube'} >
                                        <img  onClick={this.handleClick}   className={cl.menu_items} src={youtube}/>
                                    </div>
                                </div>

                                <div className={cl.item_block }>
                                    <p > {'Research'}  </p>
                                    <div name={'research'} >
                                        <img  onClick={this.handleClick} className={cl.menu_items} src={casestudy}/>
                                    </div>
                                </div>

                            </div>
                        </div> 

                        <img src={this.state.image}/>
                    </div>
            }
            </>
        )
    }

}

export default PersonNotExist;

const personsReq = (this_)=>{
    this_.setState({loading: true}) 
    document.getElementsByClassName(cl.item_block)[0].classList.add(cl.item_block_disabled)
     axios({method:'get', url: window.origin + '/' + 'aihumans' + '?req=personsnotexist' })
        .then((response)=> {
            const byteArray = new Uint8Array(response.data);

            const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust MIME type as needed
            
            const imageUrl = URL.createObjectURL(blob);

            // const img = document.createElement('img');

            this_.setState({image: imageUrl , loading: false});
            document.getElementsByClassName(cl.item_block)[0].classList.remove(cl.item_block_disabled)

        })
         .catch((response)=>{
            this_.setState({err: true, loading: false})
            document.getElementsByClassName(cl.item_block)[0].classList.remove(cl.item_block_disabled)

        });

} 


class LoadingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className={cl.lp_container}>

                <div className={cl.lp_container_top}>
                    <h2> LOADING</h2>
                </div>

                <div className={cl.lp_container_bottom}>
                    <div className={ cl.ball_1 } > </div>
                    <div className={ cl.ball_2 }> </div>
                    <div className={ cl.ball_3 }> </div>
                    <div className={ cl.ball_4 }>  </div>
                    <div className={ cl.ball_5 }> </div>

                </div>

            </div>
        )
    }
}
