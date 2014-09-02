/**
 * @jsx React.DOM
 */

"use strict";

define(["react", "models", "ka", "storage", "downloads"],
        function(React, models, KA, Storage, Downloads) {
    var cx = React.addons.classSet;

    function partial( fn /*, args...*/) {
      var aps = Array.prototype.slice;
      var args = aps.call(arguments, 1);
      return function() {
        return fn.apply(this, args.concat(aps.call(arguments)));
      };
    }

    var DomainColorMap = {
        "new-and-noteworthy": "#ffffff",
        "math": "#156278",
        "science": "#822F3D",
        "economics-finance-domain": "#BB7B31",
        "humanities": "#C43931",
        "computing": "#568F3D",
        "test-prep": "#512D60",
        "partner-content": "#399B7C",
        "talks-and-interviews": "#3C5466",
        "coach-res": "#3C5466",
        "::app-search": "#3C5466"
    };

    var TopicItem = React.createClass({
        getInitialState: function() {
            return {};
        },
        render: function() {
            var topicClassObj = {
                'topic-item': true
            };
            var parentDomain = this.props.topic.getParentDomain();
            topicClassObj[parentDomain.get("id")] = true;
            var topicClass = cx(topicClassObj);

            var divStyle = {
                float: "left;",
                width: "12px;",
                height: "100%",
                backgroundColor: DomainColorMap[this.props.topic.get("slug")]
            };
            return <li className={topicClass}>
                { this.props.topic.isRootChild() ? <div style={divStyle}/> : null }
                <a href="#" onClick={partial(this.props.onClickTopic, this.props.topic)}>
                    <p className="topic-title">{this.props.topic.get("title")}</p>
                </a>
            </li>;
        }
    });

    var VideoListItem = React.createClass({
        componentDidMount: function() {
        },
        render: function() {
            var videoNodeClass = cx({
              'video-node': true,
              'completed': this.props.completed,
              'in-progress': this.props.inProgress
            });
            var pipeClassObj = {
                'pipe': true,
                'completed': this.props.completed,
                'in-progress': this.props.inProgress
            };
            var subwayIconClassObj = {
                'subway-icon': true
            };
            var videoClassObj = {
                'video-item': true
            };
            var parentDomain = this.props.video.getParentDomain();
            if (parentDomain) {
                subwayIconClassObj[parentDomain.get("id")] = true;
                videoClassObj[parentDomain.get("id")] = true;
                pipeClassObj[parentDomain.get("id")] = true;
            }
            var subwayIconClass = cx(subwayIconClassObj);
            var pipeClass = cx(pipeClassObj);
            var videoClass = cx(videoClassObj);
            return <li className={videoClass}>
                <div className={subwayIconClass}>
                    <a href="#" onClick={partial(this.props.onClickVideo, this.props.video)}>
                        <div className={videoNodeClass}/>
                    </a>
                    <div className={pipeClass}/>
                </div>
                <a href="#" onClick={partial(this.props.onClickVideo, this.props.video)}>
                    <p className="video-title">{this.props.video.get("title")}</p>
                </a>
            </li>;
        }
    });

    var ArticleListItem = React.createClass({
        render: function() {
            var articleNodeClass = cx({
              'article-node': true,
              'completed': this.props.completed,
              'in-progress': this.props.inProgress
            });
            var pipeClassObj = {
                'pipe': true,
                'completed': this.props.completed,
                'in-progress': this.props.inProgress
            };
            var subwayIconClassObj = {
                'subway-icon': true
            };
            var articleClassObj = {
                'article-item': true
            };
            var parentDomain = this.props.article.getParentDomain();
            subwayIconClassObj[parentDomain.get("id")] = true;
            articleClassObj[parentDomain.get("id")] = true;
            pipeClassObj[parentDomain.get("id")] = true;
            var subwayIconClass = cx(subwayIconClassObj);
            var pipeClass = cx(pipeClassObj);
            var articleClass = cx(articleClassObj);
            return <li className={articleClass}>
                <div className={subwayIconClass}>
                    <a href="#" onClick={partial(this.props.onClickArticle, this.props.article)}>
                        <div className={articleNodeClass}/>
                    </a>
                    <div className={pipeClass}/>
                </div>
                <a href="#" onClick={partial(this.props.onClickArticle, this.props.article)}>
                    <p className="article-title">{this.props.article.get("title")}</p>
                </a>
            </li>;
        }
    });

    var BackButton = React.createClass({
        render: function() {
            return <div>
                <a className="icon-back-link " href="#" onClick={partial(this.props.onClickBack, this.props.model)}>
                    <span className="icon icon-back">Back</span>
                </a>
            </div>;
        }
    });

    var MenuButton = React.createClass({
        render: function() {
            return <div>
                <menu type="toolbar" className="icon-menu-link ">
                    <a href="#main-content">
                        <span className="icon icon-menu">Menu</span>
                    </a>
                </menu>
            </div>;
        }
    });

    var TopicViewer = React.createClass({
        componentDidMount: function() {
        },
        render: function() {
            if (this.props.topic.get("topics")) {
                var topics = _(this.props.topic.get("topics").models).map((topic) => {
                    return <TopicItem topic={topic}
                                      onClickTopic={this.props.onClickTopic}
                                      key={topic.get("slug")}/>;
                });
            }

            if (this.props.topic.get("contentItems")) {
                var contentItems = _(this.props.topic.get("contentItems").models).map((contentItem) => {
                    var completed = KA.APIClient.completedEntities.indexOf(contentItem.get("id")) !== -1;
                    var inProgress = !completed && KA.APIClient.startedEntities.indexOf(contentItem.get("id")) !== -1;
                    if (contentItem.isVideo()) {
                        return <VideoListItem video={contentItem}
                                              onClickVideo={this.props.onClickContentItem}
                                              key={contentItem.get("slug")}
                                              completed={completed}
                                              inProgress={inProgress} />;
                    }
                    return <ArticleListItem article={contentItem}
                                            onClickArticle={this.props.onClickContentItem}
                                            key={contentItem.get("slug")}
                                            completed={completed}
                                            inProgress={inProgress}/>;
                });
            }

            var topicList = <section data-type="list">
                            <ul>
                            {topics}
                            {contentItems}
                            </ul>
                    </section>;
            return <div>
                    {topicList}
            </div>;
        }
    });

    var ContentListViewer = React.createClass({
        render: function() {
            if (this.props.collection.models) {
                var contentItems = _(this.props.collection.models).map((contentItem) => {
                    if (contentItem.isVideo()) {
                        return <VideoListItem video={contentItem}
                                              onClickVideo={this.props.onClickContentItem}
                                              key={contentItem.get("slug")}/>;
                    }
                    return <ArticleListItem article={contentItem}
                                      onClickArticle={this.props.onClickContentItem}
                                      key={contentItem.get("slug")}/>;
                });
            }

            var topicList = <section data-type="list">
                <ul>
                    {contentItems}
                </ul>
            </section>;

            return <div>
                    {topicList}
            </div>;
        }
    });

    var TranscriptItem = React.createClass({
        render: function() {
            var startMinute = this.props.transcriptItem.start_time / 1000 / 60 | 0;
            var startSecond = this.props.transcriptItem.start_time / 1000 % 60 | 0;
            startSecond = ("0" + startSecond).slice(-2);
            return <li className="transcript-item">
                <a href="#" onClick={partial(this.props.onClickTranscript, this.props.transcriptItem)}>
                    <div>{startMinute}:{startSecond}</div>
                    <div>{this.props.transcriptItem.text}</div>
                </a>
            </li>;
        }
    });
    var TranscriptViewer = React.createClass({
        render: function() {
            if (!this.props.collection) {
                return null;
            }
            var transcriptItems = _(this.props.collection).map((transcriptItem) => {
                return <TranscriptItem transcriptItem={transcriptItem}
                                       key={transcriptItem.start_time}
                                       onClickTranscript={this.props.onClickTranscript} />;
            });
            return <ul className='transcript'>{transcriptItems}</ul>;
        }
    });

    var ArticleViewer = React.createClass({
        componentWillMount: function() {
            KA.APIClient.getArticle(this.props.article.id).done((result) => {
                this.setState({content: result.translated_html_content});
            });
        },
        componentDidMount: function() {
            this.timerId = setTimeout(this.onReportComplete.bind(this), 5000);
        },
        onReportComplete: function() {
            KA.APIClient.reportArticleRead(this.props.article.id);
        },
        componentWillUnmount: function() {
            clearTimeout(this.timerId);
        },
        getInitialState: function() {
            return {};
        },
        render: function() {
            console.log("render article: ");
            console.log(this.props.article);
            if (this.state.content) {
                return <article dangerouslySetInnerHTML={{
                    __html: this.state.content
                }}/>

            }
            return null;
        }
    });

    var VideoViewer = React.createClass({
         componentWillMount: function() {
            KA.APIClient.getVideoTranscript(this.props.video.get("youtube_id")).done((transcript) => {
                this.setState({transcript: transcript});
            });

            if (this.props.video.isDownloaded()) {
                Storage.readAsBlob(this.props.video.get("id")).done((result) => {
                    var download_url = URL.createObjectURL(result);
                    console.log('download url is: ');
                    console.log(download_url);
                    this.setState({downloadedUrl: download_url});
                });
            }

            console.log('video:');
            console.log(this.props.video);

            this.videoId = this.props.video.get("id");
            this.lastSecondWatched = KA.APIClient.videosProgress[this.videoId] || 0;
            this.secondsWatched = 0;
            this.lastReportedTime = new Date();
            this.lastWatchedTimeSinceLastUpdate = new Date();
        },
        onClickTranscript: function(obj) {
            var startSecond = obj.start_time / 1000 | 0;
            var video = this.refs.video.getDOMNode();
            video.currentTime = startSecond;
            video.play();
        },
        getInitialState: function() {
            return { };
        },
        componentDidMount: function() {
            // Add an event listener to track watched time
            var video = this.refs.video.getDOMNode();

            video.addEventListener("canplay", (e) => {
                if (this.lastSecondWatched) {
                    video.currentTime = this.lastSecondWatched;
                    console.log('set current time to: ' + video.currentTime);
                }
            });

            video.addEventListener("timeupdate", (e) => {
                var video = e.target;
                var currentSecond = video.currentTime | 0;
                var totalSeconds = video.duration | 0;

                // Sometimes a 'timeupdate' event will come before a 'play' event when
                // resuming a paused video. We need to get the play event before reporting
                // seconds watched to properly update the secondsWatched though.
                if (this.isPlaying) {
                    this.reportSecondsWatched();
                }
            }, true);

            video.addEventListener("play", (e) => {
                // Update lastWatchedTimeSinceLastUpdate so that we
                // don't count paused time towards secondsWatched
                this.lastWatchedTimeSinceLastUpdate = new Date();
                this.isPlaying = true;
            }, true);

            video.addEventListener("pause", (e) => {
                this.updateSecondsWatched();
                this.isPlaying = false;
            }, true);
        },

        // Updates the secondsWatched variable with the difference between the current
        // time and the time stamp stored in lastWatchedTimeSinceLastUpdate.
        updateSecondsWatched: function() {
            var currentTime = new Date();
            this.secondsWatched += (currentTime.getTime() - this.lastWatchedTimeSinceLastUpdate.getTime()) / 1000;
            this.lastWatchedTimeSinceLastUpdate = currentTime;
        },

        // Reports the seconds watched to the server if it hasn't been reported recently
        // or if the lastSecondWatched is at the end of the video.
        reportSecondsWatched: function() {
            if (!KA.APIClient.isLoggedIn()) {
                return;
            }

            if (!this.refs.video) {
                return;
            }

            // Report watched time to the server
            var video = this.refs.video.getDOMNode();
            this.lastSecondWatched = Math.round(video.currentTime);
            this.updateSecondsWatched();
            var currentTime = new Date();
            var secondsSinceLastReport = (currentTime.getTime() - this.lastReportedTime.getTime()) / 1000;
            if (secondsSinceLastReport >= this.MIN_SECONDS_BETWEEN_REPORTS || this.lastSecondWatched >= (video.duration | 0)) {
                this.lastReportedTime = new Date();
                console.log('report video progress duration: ' + this.props.video.get("duration"));
                KA.APIClient.reportVideoProgress(this.props.video.get("id"),
                        this.props.video.get("youtube_id"),
                        this.props.video.get("duration"),
                        this.secondsWatched,
                        this.lastSecondWatched);
                this.secondsWatched = 0;
            }
        },

        render: function() {
            var transcriptViewer;
            if (this.state.transcript) {
                 transcriptViewer = <TranscriptViewer collection={this.state.transcript}
                                                      onClickTranscript={this.onClickTranscript} />;
            }
            var videoSrc = this.props.video.get("download_urls").mp4;
            if (this.state.downloadedUrl) {
                videoSrc = this.state.downloadedUrl;
            }
            console.log('video rendered with url: ' + videoSrc);
            return <div>
                 <video ref="video" width="320" height="240" controls>
                    <source src={videoSrc} type="video/mp4"/>
                 </video>
                {transcriptViewer}
            </div>;
        },
        MIN_SECONDS_BETWEEN_REPORTS: 15
    });

    var AppHeader = React.createClass({
        render: function() {
                var backButton;
                if (this.props.isPaneShowing ||
                        this.props.model.isContent() ||
                        this.props.model.isTopic() && !this.props.model.isRoot() ||
                        this.props.model.isContentList()) {
                    backButton = <BackButton model={this.props.model}
                                             onClickBack={this.props.onClickBack}/>;
                }

                var style;
                var parentDomain = this.props.model.getParentDomain();
                if (parentDomain) {
                    var domainColor = DomainColorMap[parentDomain.get("slug")];
                    if (domainColor) {
                        style = {
                            backgroundColor: domainColor
                        };
                    }
                }

                var title = "Khan Academy";
                if (this.props.isDownloadsShowing) {
                    title = "Downloads";
                } else if (this.props.isProfileShowing) {
                    title = "Profile";
                } else if (this.props.model.get("title")) {
                    title = this.props.model.get("title");
                } else if (this.props.model.isContentList()) {
                    title = "Search";
                }

                return <header className="fixed" style={style}>
                        {backButton}
                        <MenuButton/>
                        <h1 className="header-title">{title}</h1>
                    </header>;
        }
    });


    var TopicSearch = React.createClass({
        getInitialState: function() {
            return {value: ''};
        },
        componentWillReceiveProps: function() {
            this.state.value = '';
        },
        onChange: function(event) {
            var topicSearch = event.target.value;
            this.setState({value: topicSearch});
            this.props.onTopicSearch(topicSearch);
        },
        render: function() {
            var style = {
                width: "100%",
                height: "3em;",
                position: "relative"
            };
            var text = "Search...";
            if (this.props.model.get("title")) {
                text = "Search " + this.props.model.get("title");
            }
            return <div>
                <input type="text"
                       placeholder={text}
                       value={this.state.value}
                       required=""
                       style={style}
                       onChange={this.onChange}/>
            </div>;

        }
    });

    /**
     * The sidebar drawer that comes up when you click on the menu from
     * the top header.
     */
    var Sidebar = React.createClass({
        render: function() {
            var items = [];

            if (this.props.currentModel && this.props.currentModel.isVideo()) {
                if (this.props.currentModel.isDownloaded()) {
                    items.push(<li className="hot-item">
                            <a href="#" onClick={partial(this.props.onClickDeleteDownloadedVideo, this.props.currentModel)}>Delete downloaded video</a>
                        </li>);
                } else {
                    items.push(<li className="hot-item">
                            <a href="#" onClick={partial(this.props.onClickDownloadVideo, this.props.currentModel)}>Download video</a>
                        </li>);
                }
            }

            if (KA.APIClient.isLoggedIn()) {
                // User is signed in, add all the signed in options here
                items.push(<li><a href="#" onClick={this.props.onClickProfile}>View profile</a></li>);
            } else {
                // If the user is not signed in, add that option first
                items.push(<li><a href="#" onClick={this.props.onClickSignin}>Sign in</a></li>);
            }
            items.push(<li><a href="#" onClick={this.props.onClickDownloads}>View downloads</a></li>);


            // Add the signout button last
            if (KA.APIClient.isLoggedIn()) {
                items.push(<li><a href="#" onClick={this.props.onClickSignout}>Sign out</a></li>);
            }

            return <section className="sidebar" data-type="sidebar">
                <header>
                    <menu type="toolbar">
                        <a href="#">Done</a>
                    </menu>
                    <h1>Options</h1>
                </header>
                <nav>
                    <ul>
                        {items}
                    </ul>
                </nav>
            </section>;
        }
    });

    var DownloadsViewer = React.createClass({
        render: function() {
            var control = <ContentListViewer collection={Downloads.contentList}
                                             onClickContentItem={this.props.onClickContentItem} />;
            return <div className="downloads">
                {control}
            </div>;
        }
    });

    var ProfileViewer = React.createClass({
        componentWillMount: function() {
            KA.APIClient.getUserInfo().done((result) => {
                //this.setState({content: result.translated_html_content});
                this.setState({
                    avatarUrl: result.avatar_url,
                    joined: result.joined,
                    nickname: result.nickname,
                    username: result.username,
                    points: result.points,
                    badgeCounts: result.badge_counts
                });
                console.log('user info result:');
                console.log(result);
            });
        },
        getInitialState: function() {
            return {};
        },
        render: function() {
            return <div className="profile">
                <img className="avatar" src={this.state.avatarUrl}/>
                <h1>{this.state.nickname || this.state.username}</h1>
                <h2>Points: {KA.Util.numberWithCommas(this.state.points)}</h2>

                { this.state.badgeCounts ?
                    <div>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[5]}</div>
                        <img className="badge-category-icon" title="Challenge Patches" src="img/badges/master-challenge-blue-60x60.png"/>
                    </span>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[4]}</div>
                        <img className="badge-category-icon" title="Black Hole Badges" src="img/badges/eclipse-60x60.png"/>
                    </span>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[3]}</div>
                        <img className="badge-category-icon" title="Sun Badges" src="img/badges/sun-60x60.png"/>
                    </span>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[2]}</div>
                        <img className="badge-category-icon" title="Earth Badges" src="img/badges/earth-60x60.png"/>
                    </span>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[1]}</div>
                        <img className="badge-category-icon" title="Moon Badges" src="img/badges/moon-60x60.png"/>
                    </span>
                    <span className="span2">
                        <div className="badge-category-count">{this.state.badgeCounts[0]}</div>
                        <img className="badge-category-icon" title="Meteorite Badges" src="img/badges/meteorite-60x60.png"/>
                    </span>
                    </div> : null }
            </div>;
        }
    });

    var MainView = React.createClass({
        componentWillMount: function() {
        },
        getInitialState: function() {
            return {
                currentModel: this.props.model
            };
        },
        onClickContentItem: function(model) {
            this.setState({
                currentModel: model,
                showProfile: false,
                 showDownloads: false
            });
        },
        onClickTopic: function(model) {
            this.setState({
                currentModel: model,
                showProfile: false,
                showDownloads: false
            });
        },
        onClickBack: function(model) {
            console.log('onClickBack');
            if (this.isPaneShowing()) {
                this.setState({
                    showDownloads: false,
                    showProfile: false
                });
                if (this.state.currentModel.isContentList()) {
                    this.onTopicSearch("");
                }
                return;
            }

            if (this.state.currentModel.isContentList()) {
                return this.onTopicSearch("");
            }

            var currentModel = model.get("parent");
            // If we have a download, reset back to root which
            // is stored in this.props.model.
            if (model.isContent() && model.isDownloaded()) {
                currentModel = this.props.model;
            }

            this.setState({
                currentModel: currentModel,
                showProfile: false,
                showDownloads: false
            });
        },
        onClickSignin: function() {
            KA.APIClient.login();
            this.forceUpdate();
        },
        onClickSignout: function() {
            KA.APIClient.logout();
            this.forceUpdate();
        },
        onClickProfile: function() {
            console.log('Click profile');
            this.setState({
                showProfile: true,
                showDownloads: false
            });
        },
        onClickDownloads: function(model) {
            console.log('Click downloads');
            this.setState({
                showDownloads: true,
                showProfile: false
            });
        },
        onClickDownloadVideo: function(video) {
            var videoAttributes = jQuery.extend(true, {}, video.attributes);
            delete videoAttributes.parent;
            Downloads.downloadVideo(video);
        },
        onClickDeleteDownloadedVideo: function(video) {
            console.log('click delete downloaded video');
            Downloads.deleteVideo(video);
        },
        isPaneShowing: function() {
            return this.state.showDownloads ||
                this.state.showProfile;
        },
        onTopicSearch: function(topicSearch) {
            if (!topicSearch) {
                this.setState({currentModel: this.state.searchingModel, searchingModel: null});
                return;
            }
            var searchingModel = this.state.searchingModel;
            if (!searchingModel) {
                searchingModel = this.state.currentModel;
            }
            var results = searchingModel.findContentItems(topicSearch);
            var contentList = new models.ContentList(results);
            this.setState({currentModel: contentList, searchingModel: searchingModel});
        },
        render: function() {
            var control;
            if (this.state.showProfile) {
                control = <ProfileViewer/>;
            }
            else if (this.state.showDownloads) {
                control = <DownloadsViewer onClickContentItem={this.onClickContentItem} />;
            }
            else if (this.state.currentModel.isTopic()) {
                control = <TopicViewer topic={this.state.currentModel}
                                       onClickTopic={this.onClickTopic}
                                       onClickContentItem={this.onClickContentItem}/>;
            } else if (this.state.currentModel.isContentList()) {
                control = <ContentListViewer collection={this.state.currentModel}
                                             onClickContentItem={this.onClickContentItem} />;
            } else if (this.state.currentModel.isVideo()) {
                control = <VideoViewer  video={this.state.currentModel}/>;
            } else if (this.state.currentModel.isArticle()) {
                control = <ArticleViewer  article={this.state.currentModel}/>;
            } else {
                console.error("Unrecognized content item!");
            }

            var topicSearch;
            if (!this.isPaneShowing() && !this.state.currentModel.isContent()) {
                topicSearch = <TopicSearch model={this.state.currentModel}
                                           onTopicSearch={this.onTopicSearch}/>;
            }

            return <section className="current" id="index" data-position="current">
                <Sidebar currentModel={this.state.currentModel}
                         onClickSignin={this.onClickSignin}
                         onClickSignout={this.onClickSignout}
                         onClickProfile={this.onClickProfile}
                         onClickDownloads={this.onClickDownloads}
                         onClickDownloadVideo={this.onClickDownloadVideo}
                         onClickDeleteDownloadedVideo={this.onClickDeleteDownloadedVideo}
                         />
                <section id="main-content" role="region" className="skin-dark">
                    <AppHeader model={this.state.currentModel}
                               onClickBack={this.onClickBack}
                               onTopicSearch={this.onTopicSearch}
                               isPaneShowing={this.isPaneShowing()}
                               isDownloadsShowing={this.state.showDownloads}
                               isProfileShowing={this.state.showProfile}
                               />
                        {topicSearch}
                        {control}
                </section>
            </section>;
        }
    });

    /*
    // I thought this was supposed to be needed, but it seems to not be needed
    $.ajaxSetup({
        xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}
    });
    */

    var mountNode = document.getElementById("app");

    // Init everything
    $.when(Storage.init(), KA.APIClient.init(), Downloads.init()).done(function(topicData) {
        KA.APIClient.getTopicTree().done(function(topicTreeData) {
            var topic = new models.TopicModel(topicTreeData, {parse: true});
            React.renderComponent(<MainView model={topic}/>, mountNode);
            Storage.readText("data.json").done(function(data) {
                console.log('read: ' + data);
            });
            if (KA.APIClient.isLoggedIn()) {

                // TODO: This should be called, but will eventually be moved into
                // some sort of cache update part of the code.
                // The call is needed so we get KA.APIClient.videoProgress
                KA.APIClient.getUserVideos();
                KA.APIClient.getUserProgress().done(function(completedEntities, startedEntities) {
                    console.log("getUserProgress:");
                    console.log(completedEntities);
                    console.log(startedEntities);
                });
            } else {
                console.log('Not logged in!');
            }

            // TODO: remove, just for easy inpsection
            window.topic = topic;
            window.KA = KA;
            window.React = React;
        });
     });
});
