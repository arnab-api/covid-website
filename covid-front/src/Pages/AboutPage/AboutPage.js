import React from 'react';
import './AboutPage.css';
import personImage from '../../images/dp.jpg'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import { Box, Flex, Text, Image, Heading } from "@chakra-ui/core";

import sajib_sir_img from "./images/sajib_sir.png"
import jonyh_sir_img from "./images/jonyh_sir.jpg"
import dhrubo_sir_img from "./images/dhrubo_sir.jpg"
import api_img from "./images/api.jpg"

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";



const useStyles = makeStyles({
  root: {
    margin: 2,
    width: '24%',
    height: 530,
    display: 'flex'
  },
  def_root: {
    margin: 2,
    width: '40%',
    display: 'flex'
  },
  pub_root: {
    margin: 2,
    width: '90%',
    display: 'flex'
  },
  media: {
    height: 430,
    // height: 350,
    // paddingTop: '56.25%', // 16:9,
    // marginTop:'30'
  },
  content: {
    height: 100
  },
  pub_content: {
    // height: 150
  }
});

const AboutPage = () => {
  const classes = useStyles();

  const about_us_info = [
    {
      "name": "Arnab Sen Sharma", 
      "designation": "Lecturer",
      "institution": "Shahjalal University of Science and Technology",
      "image_path": api_img
    },
    {
      "name": "Dr. Md Enamul Hoque", 
      "designation": "Assistant Professor",
      "institution": "Shahjalal University of Science and Technology",
      "image_path": jonyh_sir_img
    },
    {
      "name": "Dr. Md. Shariful Islam",
      "designation": "Assistant Professor",
      "institution": "North South University",
      "image_path": dhrubo_sir_img
    },
    {
      "name": "Dr. Ruhul Amin",
      "designation": "Assistant Professor",
      "institution": "Fordhum University",
      "image_path": sajib_sir_img
    },
  ]

  const terms = [
    {
      "name": "R0",
      "definition": "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
    },
    {
      "name": "R0",
      "definition": "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
    },
    {
      "name": "R0",
      "definition": "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
    },
    {
      "name": "R0",
      "definition": "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
    },
  ]

  const publications = [
    "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself.",
    "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself.",
    "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself.",
    "R0, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
  ]

  return (
    // <div className="aboutPage">
    //   <div className="aboutPage__card">
    //     <div className="aboutPage__personImage">
    //       <img src={personImage} alt="" />
    //     </div>
    //     <div className="aboutPage__personDetails">
    //       <h2>John Doe</h2>
    //       <p>Student at Trinity College Dublin</p>
    //     </div>
    //   </div>
    //   <div className="aboutPage__card">
    //     <div className="aboutPage__personImage">
    //       <img src={personImage} alt="" />
    //     </div>
    //     <div className="aboutPage__personDetails">
    //       <h2>John Doe</h2>
    //       <p>Student at Trinity College Dublin</p>
    //     </div>
    //   </div>
    // </div>
    <>
    <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
      <h2>
          Some definitions
      </h2>
      <hr/>
    </Text>
    <Flex wrap="wrap" width="100%" justify="center" align="center">
      {
        terms.map((term) => (
          <Card className={classes.def_root}>
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h6" component="h2">
                <strong>{term.name}</strong>
              </Typography> 
              <Typography gutterBottom variant="body2" component="h2">
                {term.definition}
              </Typography>
            </CardContent>
          </Card>
        ))
      }
    </Flex>
    <br/>
    <br/>

    <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
      <h2>
          Publication list
      </h2>
      <hr/>
    </Text>
    <Flex wrap="wrap" width="100%" justify="center" align="center">
      {
        publications.map((pub) => (
          <Card className={classes.pub_root}>
            <CardContent className={classes.pub_content}>
              <Typography gutterBottom variant="body2" component="h2">
                {pub}
              </Typography>
            </CardContent>
          </Card>
        ))
      }
    </Flex>
    <br/>
    <br/>

    <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
      <h2>
          About us
      </h2>
      <hr/>
    </Text>
    <Flex wrap="wrap" width="100%" height="100%" justify="center" align="center">
        {
          about_us_info.map((person) => (
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={person.image_path}
                  title="Contemplative Reptile"
                />
                <CardContent className={classes.content}>
                  <Typography gutterBottom variant="h6" component="h2">
                    <strong>{person.name}</strong>
                  </Typography>
                  <Typography gutterBottom variant="body2" component="h2">
                    {person.designation},<br/>
                    {person.institution}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography> */}
                </CardContent>
              </CardActionArea>
              {/* <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions> */}
            </Card>
          ))
        }
    </Flex>
    </>
  );
};

export default AboutPage;