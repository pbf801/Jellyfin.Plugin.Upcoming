using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace Jellyfin.Plugin.Upcoming.Configuration;

public class PluginConfiguration : BasePluginConfiguration
{
    public List<UpcomingItem> Items { get; set; } = new();
}

public class UpcomingItem
{
    public Guid ItemId { get; set; }

    public bool Upcoming { get; set; } = true;

    public DateTime ReleaseDate { get; set; }

    public bool ShowCountdown { get; set; } = true;

    public bool BlockPlayback { get; set; } = true;

    public bool ShowInUpcoming { get; set; } = true;

    public string? TrailerUrl { get; set; }

    public string? EditorialText { get; set; }
}
