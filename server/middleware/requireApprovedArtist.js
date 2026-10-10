const Artist = require('../models/Artist');

async function requireApprovedArtist(req, res, next) {
  try {
    const artist = await Artist.findById(req.artistId).select('email');

    if (!artist) {
      return res.status(401).json({
        error: 'Artist account not found.',
      });
    }

    const approvedEmail = process.env.ARTIST_EMAIL?.trim().toLowerCase();

    if (!approvedEmail) {
      console.error('ARTIST_EMAIL is not configured.');

      return res.status(500).json({
        error: 'Artist authorization is not configured.',
      });
    }

    if (artist.email.toLowerCase() !== approvedEmail) {
      return res.status(403).json({
        error: 'You are not authorized to access artist features.',
      });
    }

    next();
  } catch (err) {
    console.error('Artist authorization error:', err);

    return res.status(500).json({
      error: 'Failed to verify artist authorization.',
    });
  }
}

module.exports = requireApprovedArtist;