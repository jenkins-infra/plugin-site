import {graphql, useStaticQuery} from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';

const JenkinsVoltron = () => {
    const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "jenkins-voltron-271x294x8.png" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);
    return (
        <Img
            {...data.file.childImageSharp}
            alt="Jenkins Plugin Logo"
        />
    );
};

export default JenkinsVoltron;
