using System;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Controller;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using Jellyfin.Plugin.Upcoming.Configuration;

namespace Jellyfin.Plugin.Upcoming;

public class Plugin : BasePlugin<PluginConfiguration>,
    IHasWebPages
{
    public static Plugin Instance { get; private set; } = null!;

    public Plugin(
        IApplicationPaths applicationPaths,
        IXmlSerializer xmlSerializer)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
    }

    public override string Name => "Jellyfin Upcoming";

    public override Guid Id =>
        Guid.Parse("6d8c0b3d-0e54-4c1a-91d2-4c0b2d6a8a71");

    public override string Description =>
        "Adds manually managed upcoming releases to Jellyfin.";

    public IEnumerable<PluginPageInfo> GetPages()
    {
        return new[]
        {
            new PluginPageInfo
            {
                Name = "upcoming",
                EmbeddedResourcePath =
                    "Jellyfin.Plugin.Upcoming.Web.config.html"
            }
        };
    }
}
