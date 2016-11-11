$(document).ready(function() {
  $("#channel-container").html("");
  getTwitchData();
  getTwitchFeaturedData();
});

/* Call to - featured channels */
function getTwitchFeaturedData() {
  var apiFeaturedUrl = 'https://wind-bow.hyperdev.space/twitch-api/streams/featured?limit=25&offset=0';
  $.getJSON(apiFeaturedUrl, function(data) {
    data.featured.forEach(function(channelData) {
      // Channel is offline
      if (channelData.stream === null) {
        buildOfflineChannel(channelData.stream.channel);
      }
      // Channel is online
      else {
        buildOnlineChannel(channelData);
      }
    });
  });
}

/* Call to Twitch TV API - provided channels */
function getTwitchData() {
  var providedChannelsArr = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas",
    "brunofin",
    "comster404"
  ];
  providedChannelsArr.forEach(function(channel) {
    var apiUrl = 'https://wind-bow.hyperdev.space/twitch-api/streams/' + channel + '?callback=?';
    $.getJSON(apiUrl, function(data) {
      // Channel is offline
      if (data.stream === null) {
        buildOfflineChannel(channel);
      }
      // Account doesn't exist
      else if (data.stream === undefined) {
        buildClosedChannel(channel);
      }
      // Channel is online
      else {
        buildOnlineChannel(data);
      }
    });
  });
}

/* Builds up an offline channel object */
function buildOfflineChannel(channel) {
  var channelApiUrl = 'https://wind-bow.hyperdev.space/twitch-api/channels/' + channel + '?callback=?';
  $.getJSON(channelApiUrl, function(channelData) {
    var offlineChannelObj = {};
    offlineChannelObj["status"] = "Offline";
    offlineChannelObj["logoUrl"] = channelData.logo;
    offlineChannelObj["displayName"] = channelData.display_name;
    offlineChannelObj["channelUrl"] = channelData.url;
    offlineChannelObj["pannelClass"] = "offline-panel";
    offlineChannelObj["iconClass"] = "fa fa-times-circle offline-color";
    drawChannel(offlineChannelObj);
  });
}

/* Builds up a closed channel object */
function buildClosedChannel(channel) {
  var closedChannelObj = {};
  closedChannelObj["status"] = "Account closed";
  closedChannelObj["logoUrl"] = "http://marlborofishandgame.com/images/6/6c/Question-mark.png";
  closedChannelObj["displayName"] = channel;
  closedChannelObj["channelUrl"] = null;
  closedChannelObj["pannelClass"] = "closed-panel";
  closedChannelObj["iconClass"] = "fa fa-question-circle closed-color";
  drawChannel(closedChannelObj);
}

/* Builds up an onlide channel object */
function buildOnlineChannel(data) {
  var onlineChannelObj = {};
  onlineChannelObj["status"] = "[Streaming] " + data.stream.channel.status;
  onlineChannelObj["logoUrl"] = data.stream.channel.logo;
  onlineChannelObj["displayName"] = data.stream.channel.display_name;
  onlineChannelObj["channelUrl"] = data.stream.channel.url;
  onlineChannelObj["pannelClass"] = "online-panel";
  onlineChannelObj["iconClass"] = "fa fa-check-circle online-color";
  drawChannel(onlineChannelObj);
}

/* Calls Draw Channels functions */
function drawChannel(channel) {
  var channelHtml = '<div class="twitch-user-wrapper col-lg-4 col-md-4 col-sm-12 col-xs-12 animated fadeIn">';
  channelHtml += '<div class="panel panel-default ' + channel.pannelClass + '">';
  channelHtml += '<div class="panel-body">';
  channelHtml += '<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">';
  channelHtml += '<img src="' + channel.logoUrl + '" class="channel-img img-responsive center-block img-circle" alt="' + channel.displayName + '">';
  channelHtml += '</div><div class="text-center col-lg-7 col-md-7 col-sm-12 col-xs-12"><h2 class="channel-title">';
  channelHtml += '<a href="' + channel.channelUrl + '" target="_blank">' + channel.displayName + '</a>&nbsp;';
  channelHtml += '<i class="' + channel.iconClass + '"></i>';
  channelHtml += '</h2></div><div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12">';
  channelHtml += '<p class="channel-desc">Status: ' + channel.status + '</p>';
  channelHtml += '</div></div></div></div>';
  $("#channel-container").append(channelHtml);
}
