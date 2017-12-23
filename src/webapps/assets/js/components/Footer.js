import React from 'react'

export default class Footer extends React.Component {
    render() {
        return (

                <footer >
                    <p className="title">What is HyperMap</p>
                    <p>"A place that you can post and engage any events."</p>
                    <ul>
                        <li>
                            <p><i className="fa fa-map-o fa-2x"></i></p>
                            <p>Carnegie Mellon University, PA</p>
                        </li>
                        <li>
                            <p><i className="fa fa-user fa-2x"></i></p>
                            <p>Jiawen Peng, Weijian Li, Tianjian Meng</p>
                            <p></p>
                        </li>
                        <li>
                            <p><i className="fa fa-envelope-o fa-2x"></i></p>
                            <p>{'{jiawenp1, weijian1, tianjiam}@andrew.cmu.edu'}</p>
                        </li>
                    </ul>
                </footer>

        )
    }
}
