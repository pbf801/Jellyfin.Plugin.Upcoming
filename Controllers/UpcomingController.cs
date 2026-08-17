using System;
using System.Collections.Generic;
using System.Linq;
using Jellyfin.Plugin.Upcoming.Configuration;
using MediaBrowser.Common.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jellyfin.Plugin.Upcoming.Controllers;

[Authorize]
[Route("Upcoming")]
public class UpcomingController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<UpcomingItem>> Get()
    {
        var items = Plugin.Instance
            .Configuration
            .Items
            .Where(x => x.Upcoming && x.ShowInUpcoming)
            .ToList();

        return Ok(items);
    }

    [HttpGet("{itemId}")]
    public ActionResult<UpcomingItem?> Get(Guid itemId)
    {
        var item = Plugin.Instance
            .Configuration
            .Items
            .FirstOrDefault(x => x.ItemId == itemId);

        if (item == null)
            return NotFound();

        return Ok(item);
    }

    [HttpPost]
    public ActionResult Save([FromBody] UpcomingItem model)
    {
        var configuration = Plugin.Instance.Configuration;

        var existing = configuration.Items
            .FirstOrDefault(x => x.ItemId == model.ItemId);

        if (existing != null)
        {
            existing.Upcoming = model.Upcoming;
            existing.ReleaseDate = model.ReleaseDate;
            existing.ShowCountdown = model.ShowCountdown;
            existing.BlockPlayback = model.BlockPlayback;
            existing.ShowInUpcoming = model.ShowInUpcoming;
            existing.TrailerUrl = model.TrailerUrl;
            existing.EditorialText = model.EditorialText;
        }
        else
        {
            configuration.Items.Add(model);
        }

        Plugin.Instance.SaveConfiguration();

        return Ok(model);
    }

    [HttpDelete("{itemId}")]
    public ActionResult Delete(Guid itemId)
    {
        var configuration = Plugin.Instance.Configuration;

        configuration.Items.RemoveAll(x => x.ItemId == itemId);

        Plugin.Instance.SaveConfiguration();

        return NoContent();
    }
}
