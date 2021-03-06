require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const Slack = require('slack-node');

const webhookUri = process.env.SLACK_WEBHOOK_URI;
const slackChannel = process.env.SLACK_CHANNEL;
const slack = new Slack();
slack.setWebhook(webhookUri);

const reddit = new Snoowrap({
    userAgent: slackChannel,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
const client = new Snoostorm(reddit);

const streamOpts = {
    subreddit: 'cryptocurrency',
    // subreddit: 'testingground4bots',
    results: 25
};
const comments = client.CommentStream(streamOpts);

comments.on('comment', (comment) => {
    if (comment.body.indexOf('manipulation') !== -1 || comment.body.indexOf('manipulate') !== -1) {
        slack.webhook({
            channel: '#' + slackChannel,
            username: process.env.REDDIT_USER,
            text: '*' + comment.link_title + '*\n' + comment.body
        }, (err, response) => {
            console.log(response.status);
        });
        comment.reply('Manipulation? Everyone is always talking about that around here.  I wonder a) who specifically is doing this manipulation and b) how I can get in on that action.');
    }
})