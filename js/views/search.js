/* @flow */

"use strict";

var $ = require("jquery"),
    React = require("react/addons"),
    l10n = require("../l10n"),
    topicViews = require("./topic");

var ContentListViewer = topicViews.ContentListViewer;

/**
 * Represents the topic search input item which is right below the header.
 */
var TopicSearch = React.createClass({
    propTypes: {
        model: React.PropTypes.object.isRequired,
        onTopicSearch: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            searchValue: ""
        };
    },
    onChange: function(event: any) {
        var topicSearch = event.target.value;
        this.setState({
            searchValue: topicSearch
        });
        this.props.onTopicSearch(topicSearch);
    },
    handleFocus: function(event: any) {
        setTimeout(() => {
            $("html, body").stop(true, true).animate({
                scrollTop: $(this.refs.search.getDOMNode()).offset().top
            }, 500);
        }, 500);
    },
    handleBlur: function(event: any) {
        $("html, body").stop(true, true).animate({
            scrollTop: 0
        }, 700);
    },

    render: function(): any {
        var text = l10n.get("search");
        if (this.props.model.getTitle()) {
            text = l10n.get("search-topic", {
                topic: this.props.model.getTitle()
            });
        }
        return <div>
            <input ref="search"
                   className="search app-chrome"
                   type="searh"
                   placeholder={text}
                   value={this.state.searchValue}
                   required=""
                   onChange={this.onChange}
                   onFocus={this.handleFocus}
                   onBlur={this.handleBlur}
                   />
        </div>;

    }
});

/**
 * Represents a search result list which is basically just a wrapper around a
 * ContentListViewer for now.
 */
var SearchResultsViewer = React.createClass({
    propTypes: {
        collection: React.PropTypes.object.isRequired,
        onClickContentItem: React.PropTypes.func.isRequired
    },
    render: function(): any {
        var control = <ContentListViewer collection={this.props.collection}
                                         onClickContentItem={this.props.onClickContentItem} />;
        return <div className="topic-list-container">
            {control}
        </div>;
    }
});

module.exports = {
    TopicSearch,
    SearchResultsViewer,
};
