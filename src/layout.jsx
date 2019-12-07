import React from 'react';
import { Helmet } from 'react-helmet';
import './styles/ubuntu-fonts.css';
import './styles/lato-fonts.css';
import './styles/roboto-fonts.css';
import './styles/base.css';
import './styles/font-icons.css';
export default function Layout({ children }) {
  return (
    <div>
      <Helmet>
        <title >
          Title must not be empty
        </title>
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta content="{{ description }}" name="description" />
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="ie=edge" httpEquiv="x-ua-compatible" />
        <link href="https://jenkins.io/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="https://jenkins.io/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="https://jenkins.io/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="https://jenkins.io/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link color="#5bbad5" href="https://jenkins.io/safari-pinned-tab.svg" rel="mask-icon" />
        <meta content="#2b5797" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color" />
        <meta content="{{ title }}" name="apple-mobile-web-app-title" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="@JenkinsCI" name="twitter:site" />
        <meta content="{{ title }}" name="twitter:title" />
        <meta content="{{ description }}" name="twitter:description" />
        <meta content="@JenkinsCI" name="twitter:creator" />
        <meta content="{{ opengraphImage }}" name="twitter:image" />
        <meta content="{{ title }}" property="og:title" />
        <meta content="article" property="og:type" />
        <meta content="https://jenkins.io/template/index.html" property="og:url" />
        <meta content="{{ description }}" name="og:description" />
        <meta content="{{ title }}" property="og:site_name" />
        <meta content="{{ opengraphImage }}" name="og:image" />
        <style >
          {`body { padding-top: 40px; } @media screen and (max-width: 768px) { body { padding-top: 0px; } } `}
        </style>
        <style >
          {`#grid-box { position: relative } `}
        </style>
        <style >
          {`html { min-height:100%; position: relative; }`}
        </style>
        <link href="https://jenkins.io/assets/bower/bootstrap/css/bootstrap.min.css" media="all" rel="stylesheet" type="text/css" />
        <link href="https://jenkins.io/assets/bower/tether/css/tether.min.css" media="all" rel="stylesheet" type="text/css" />
        <link href="https://jenkins.io/css/jenkins.css" media="all" rel="stylesheet" type="text/css" />
        <link href="https://jenkins.io/assets/bower/ionicons/css/ionicons.min.css" media="all" rel="stylesheet" type="text/css" />
        <link href="https://jenkins.io/css/footer.css" media="all" rel="stylesheet" type="text/css" />
        <link href="https://jenkins.io/css/font-awesome.min.css" media="all" rel="stylesheet" type="text/css" />
        <link type="text/css" rel="stylesheet" href="https://wiki.jenkins.io/s/f68dfafb2b4588f7b31742327b4469ae-CDN/en_GB/6441/82994790ee2f720a5ec8daf4850ac5b7b34d2194/be65c4ed0984ca532b26983f5fc1813e/_/download/contextbatch/css/_super/batch.css?atlassian.aui.raphael.disabled=true" data-wrm-key="_super" data-wrm-batch-type="context" media="all" />
      </Helmet>
      <nav className="navbar navbar-expand-lg navbar-dark top bg-dark fixed-top" id="ji-toolbar">
        <a className="navbar-brand" href="https://jenkins.io">
          
Jenkins
        </a>
        <button className="navbar-toggler" data-target="#CollapsingNavbar" data-toggle="collapse" type="button">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="CollapsingNavbar">
          <ul className="nav navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                <svg width="36" height="18" xmlns="http://www.w3.org/2000/svg" role="img" xlink="http://www.w3.org/1999/xlink" viewBox="-3.23 44.77 362.70 271.95">
                  <defs >
                    <linearGradient id="a" x1="359.765" x2="104.082" y1="134.295" y2="124.577" gradientTransform="matrix(1 0 0 -1 0 439.068)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#ed1c24" />
                      <stop offset="1" stopColor="#f7941d" />
                    </linearGradient>
                    <linearGradient id="b" x1="355.202" x2="99.519" y1="254.467" y2="244.749" href="#a" />
                    <linearGradient id="c" x1="183.903" x2="10.612" y1="227.598" y2="221.023" href="#a" />
                    <linearGradient id="d" x1="367.119" x2="157.995" y1="265.311" y2="257.091" href="#a" />
                  </defs>
                  <path fill="#c49a6c" d="M231.52 309.278c2.483-.332 4.895-.77 7.255-1.329s4.649-1.206 6.991-1.957c13.494-4.58 25.187-12.952 36.374-24.593l-.14-.175c-14.944 15.486-30.693 25.344-50.48 28.054z" />
                  <path fill="url(#a)" d="M224.232 309.96h.332c1.084 0 2.15-.14 3.216-.228a93.844 93.844 0 0 1-3.233.227z" />
                  <path fill="url(#b)" d="M284.692 187.187l-.122.192.122-.192z" />
                  <path fill="url(#c)" d="M146.145 231.847a150.844 150.844 0 0 1-12.97 15.862c-7.582 7.889-15.507 13.563-24.652 16.667a47.832 47.832 0 0 1-4.738 1.326 56.959 56.959 0 0 1-4.916.9 38.32 38.32 0 0 1-1.682.214l-.912.083c-.723.059-1.445.118-2.18.154h-3.068a42.325 42.325 0 0 1-9.192-1.043 49.977 49.977 0 0 1-6.764-2.002 43.097 43.097 0 0 1-4.525-1.954c-1.493-.77-2.961-1.516-4.407-2.37a59.5 59.5 0 0 1-17.105-15.399 59.714 59.714 0 0 1-2.914-4.311 53.09 53.09 0 0 1-1.291-2.263 51.985 51.985 0 0 1-2.263-4.738 46.72 46.72 0 0 1 0-36.426 51.986 51.986 0 0 1 2.263-4.738 54.14 54.14 0 0 1 1.291-2.263 59.742 59.742 0 0 1 2.914-4.311 59.714 59.714 0 0 1 17.105-15.4 60.828 60.828 0 0 1 4.407-2.369q2.217-1 4.525-1.777a49.976 49.976 0 0 1 6.906-2.073 42.325 42.325 0 0 1 9.192-1.042h3.128c.722 0 1.445.094 2.155.154l1.043.106 1.019.119c1.8.237 3.553.557 5.271.96.853.2 1.694.426 2.523.663a51.186 51.186 0 0 1 11.846 5.176 59.645 59.645 0 0 1 4.395 2.89 74.485 74.485 0 0 1 8.386 7.108q2.038 1.99 4.063 4.193l.083-.13a159.395 159.395 0 0 1 11.064 13.942c5.437-8.576 13.658-21.464 16.584-25.74 1.185-1.718 2.37-3.46 3.66-5.212-13.54-16.513-29.827-30.23-51.587-36.082h-.154a89.397 89.397 0 0 0-3.187-.794l-.45-.107a92.565 92.565 0 0 0-3.151-.627l-.628-.119a80.578 80.578 0 0 0-3.743-.569h-.142a58.29 58.29 0 0 0-2.073-.236h-.391l-1.872-.166h-.568l-1.754-.119h-.675l-1.777-.07h-3.115c-46.447-.25-87.125 40.476-87.125 86.911s40.725 87.173 87.172 87.173h3.14l1.729-.071h.734l1.67-.095h.676l1.706-.154h.568l1.813-.213.414-.06 1.967-.272h.213a125.91 125.91 0 0 0 3.553-.628l.652-.142c.96-.201 1.907-.415 2.855-.64l.58-.142a86.66 86.66 0 0 0 3.009-.817l.237-.071c20.73-6.077 36.425-19.392 49.55-35.277-2.037-3.068-3.4-5.366-4.039-6.48z" />
                  <path fill="url(#d)" d="M318.05 51.733v94.66a85.514 85.514 0 0 0-52.595-18.729h-3.115l-1.777.072-.7.047-1.752.118h-.569l-1.871.166h-.391c-.7.071-1.386.142-2.073.237h-.154c-1.256.154-2.5.355-3.732.569l-.628.118c-1.066.19-2.108.403-3.15.628l-.45.107c-30.35 6.858-50.333 28.808-66.822 52.82-.7 1.018-1.35 2.049-2.038 3.068-2.25 3.423-5.46 8.422-8.635 13.397-4.17 6.527-8.292 13.03-9.939 15.66l20.624 32.137s21.997 40.465 61.68 51.482l.237.07c.995.297 2.002.558 3.009.818l.58.142c.936.237 1.896.439 2.855.64l.652.142c1.184.225 2.369.439 3.553.628h.214l1.966.273.415.059 1.812.213h.569l1.705.154h.676l1.67.095h.734l1.73.07h3.139c54.703 0 86.355-30.964 87.149-85.063V51.733zm-52.595 215.403h-3.068c-.734 0-1.457-.095-2.18-.154l-.912-.083c-.568-.06-1.125-.13-1.682-.213a49.077 49.077 0 0 1-9.571-2.275 49.612 49.612 0 0 1-6.634-2.83 55.792 55.792 0 0 1-6.254-3.768 63.068 63.068 0 0 1-3.009-2.215 82.399 82.399 0 0 1-8.683-7.925l-.095.119c-1.255-1.303-2.487-2.69-3.731-4.11-.154-.167-.296-.356-.45-.534-.628-.722-1.256-1.445-1.884-2.215s-1.125-1.398-1.682-2.097-.888-1.101-1.338-1.682a184.467 184.467 0 0 1-6.053-8.292c-.7-.995-1.398-2.025-2.109-3.056-.379-.569-.77-1.184-1.185-1.73-.675-1.018-1.362-2.013-2.049-3.056l-.355-.545c-1.185-1.812-2.37-3.684-3.649-5.603q2.95-4.608 5.817-8.86c1.907-2.831 3.79-5.556 5.662-8.138s3.72-5.046 5.591-7.38 3.72-4.525 5.603-6.586q2.026-2.203 4.063-4.194c1.374-1.338 2.748-2.594 4.158-3.778s2.807-2.287 4.252-3.329a57.594 57.594 0 0 1 7.748-4.62c.331-.166.663-.367 1.006-.533l.226-.118c1.41-.652 2.843-1.185 4.3-1.73l.485-.201c.273-.083.557-.142.83-.237a44.943 44.943 0 0 1 3.34-.948l1.374-.343a60.798 60.798 0 0 1 4.738-.841l1.019-.119 1.042-.106c.711 0 1.434-.119 2.156-.154h3.128a42.431 42.431 0 0 1 4.572.26 48.011 48.011 0 0 1 6.93 1.35c1.54.427 3.08.925 4.596 1.505a48.724 48.724 0 0 1 4.525 1.955c1.493.722 2.961 1.516 4.407 2.369s2.866 1.8 4.24 2.784 2.725 2.049 4.028 3.174a58.459 58.459 0 0 1 8.837 9.477 59.73 59.73 0 0 1 2.914 4.312 51.067 51.067 0 0 1 5.318 11.916 47.38 47.38 0 0 1 1.185 5.165 45.567 45.567 0 0 1 .71 8.09c.072 35.964-16.062 52.122-52.227 52.122z" />
                </svg>
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item feature" href="https://cd.foundation/">
                  
What is CDF?
                </a>
                <a className="dropdown-item feature" href="https://jenkins-x.io/">
                  
Jenkins X
                </a>
                <a className="dropdown-item feature" href="https://cloud.google.com/tekton/">
                  
Tekton
                </a>
                <a className="dropdown-item feature" href="https://www.spinnaker.io/">
                  
Spinnaker
                </a>
              </div>
            </li>
          </ul>
          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="https://jenkins.io/node">
                
Blog
              </a>
            </li>
            <li className="nav-item dropdown">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                
Documentation
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="https://jenkins.io/doc">
                  
Use Jenkins
                </a>
                <a className="dropdown-item" href="https://jenkins.io/doc/developer">
                  
Extend Jenkins
                </a>
                <span className="dropdown-item">
                  <strong >
                    
Use-cases
                  </strong>
                </span>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/android">
                  
 - Android
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/c">
                  
 - C/C++
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/docker">
                  
 - Docker
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/embedded">
                  
 - Embedded
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/github">
                  
 - GitHub
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/java">
                  
 - Java
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/php">
                  
 - PHP
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/pipeline">
                  
 - Continuous Delivery
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/python">
                  
 - Python
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/solutions/ruby">
                  
 - Ruby
                </a>
              </div>
            </li>
            <li className="active nav-item">
              <a className="nav-link" href="https://plugins.jenkins.io/">
                
Plugins
              </a>
            </li>
            <li className="nav-item dropdown">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                
Community
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item feature" href="https://jenkins.io/participate">
                  
Overview
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/chat" title="Chat with the rest of the Jenkins community on IRC">
                  
Chat
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/jam">
                  
Meet
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/events">
                  
Events
                </a>
                <a className="dropdown-item feature" href="https://issues.jenkins-ci.org/">
                  
Issue Tracker
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/mailing-lists" title="Browse Jenkins mailing list archives and/or subscribe to lists">
                  
Mailing Lists
                </a>
                <a className="dropdown-item feature" href="https://wiki.jenkins.io/">
                  
Wiki
                </a>
                <a className="dropdown-item feature" href="https://accounts.jenkins.io/" title="Create/manage your account for accessing wiki, issue tracker, etc">
                  
Account Management
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/">
                  <strong >
                    
Special Interest Groups
                  </strong>
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/advocacy-and-outreach/">
                  
 - Advocacy and Outreach
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/chinese-localization/">
                  
 - Chinese Localization
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/cloud-native/">
                  
 - Cloud Native
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/docs/">
                  
 - Documentation
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/gsoc/">
                  
 - Google Summer of Code
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/hw-and-eda/">
                  
 - Hardware and EDA
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/pipeline-authoring/">
                  
 - Pipeline Authoring
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/sigs/platform/">
                  
 - Platform
                </a>
              </div>
            </li>
            <li className="dropdown nav-item">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                
Subprojects
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item feature" href="https://jenkins.io/projects/">
                  
Overview
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/blueocean/">
                  
Blue Ocean
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/evergreen/">
                  
Evergreen
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/gsoc/">
                  
Google Summer of Code in Jenkins
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/infrastructure/">
                  
Infrastructure
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/jam/">
                  
Jenkins Area Meetups
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/jcasc/">
                  
Jenkins Configuration as Code
                </a>
                <a className="dropdown-item feature" href="https://jenkins.io/projects/remoting/">
                  
Jenkins Remoting
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                
About
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="https://jenkins.io/security">
                  
Security
                </a>
                <a className="dropdown-item" href="https://jenkins.io/press">
                  
Press
                </a>
                <a className="dropdown-item" href="https://jenkins.io/awards">
                  
Awards
                </a>
                <a className="dropdown-item" href="https://jenkins.io/project/conduct">
                  
Conduct
                </a>
                <a className="dropdown-item" href="https://jenkins.io/artwork">
                  
Artwork
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <button aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown">
                
English
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="https://jenkins.io/zh">
                  
中文 Chinese
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link btn btn-outline-secondary" href="https://jenkins.io/download">
                
Download
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="pt-4">
      </div>
      <div id="grid-box">
        {children}
      </div>
      <script src="https://jenkins.io/assets/bower/anchor-js/anchor.min.js" />
      <script src="https://jenkins.io/assets/bower/tether/js/tether.min.js" />
      <script src="https://jenkins.io/assets/bower/bootstrap/js/bootstrap.min.js" />
      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="license-box">
                <div id="creativecommons">
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                    <p >
                      <img alt="Creative Commons Attribution-ShareAlike license" src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" />
                    </p>
                  </a>
                  <p >
                    
The content driving this site is licensed under the Creative
Commons Attribution-ShareAlike 4.0 license.
                  </p>
                </div>
              </div>
            </div>
            <div className="links col-md-8">
              <div className="container">
                <div className="row">
                  <div className="area col-md-3">
                    <div className="div-mar">
                      <h5 >
                        Resources
                      </h5>
                      <ul className="resources">
                        <li >
                          <a href="https://jenkins.io/download">
                            
Downloads
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/node">
                            
Blog
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/doc">
                            
Documentation
                          </a>
                        </li>
                        <li >
                          <a href="https://plugins.jenkins.io/">
                            
Plugins
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/security">
                            
Security
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/participate">
                            
Contributing
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="area col-md-3">
                    <div className="div-mar">
                      <h5 >
                        Project
                      </h5>
                      <ul className="project">
                        <li >
                          <a href="https://jenkins.io/project">
                            
Structure and governance
                          </a>
                        </li>
                        <li >
                          <a href="https://issues.jenkins-ci.org">
                            
Issue tracker
                          </a>
                        </li>
                        <li >
                          <a href="https://wiki.jenkins.io">
                            
Wiki
                          </a>
                        </li>
                        <li >
                          <a href="https://github.com/jenkinsci">
                            
GitHub
                          </a>
                        </li>
                        <li >
                          <a href="https://ci.jenkins.io">
                            
Jenkins on Jenkins
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="area col-md-3">
                    <div className="div-mar">
                      <h5 >
                        Community
                      </h5>
                      <ul className="community">
                        <li >
                          <a href="https://jenkins.io/events">
                            
Events
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/mailing-lists">
                            
Mailing lists
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/chat">
                            
Chats
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/sigs">
                            
Special Interest Groups
                          </a>
                        </li>
                        <li >
                          <a href="https://twitter.com/jenkinsci">
                            
Twitter
                          </a>
                        </li>
                        <li >
                          <a href="https://reddit.com/r/jenkinsci">
                            
Reddit
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="area col-md-3">
                    <div className="div-mar">
                      <h5 >
                        Other
                      </h5>
                      <ul className="other">
                        <li >
                          <a href="https://jenkins.io/conduct">
                            
Code of Conduct
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/press">
                            
Press information
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/merchandise">
                            
Merchandise
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/artwork">
                            
Artwork
                          </a>
                        </li>
                        <li >
                          <a href="https://jenkins.io/awards">
                            
Awards
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <script >
        {`
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
 
ga('create', 'UA-4216293-5', 'auto');
ga('send', 'pageview');
ga('set', 'anonymizeIp', true);

`}
      </script>
      <script >
        {`
  !function(d,s,id) {
    var js, fjs=d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id=id;
      js.src="//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs");
  
  $(function(){
    var $body = $(document.body);
    $(".nav-link.dropdown-toggle").on("mousedown", function(){
      $body.addClass("no-outline");
    })
    $body.on("keydown", function(){
      $body.removeClass("no-outline");
    })
  })
`}
      </script>
    </div>
  );
}