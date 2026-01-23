import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Button,
  Flex,
  Box,
  Divider,
  Heading,
  Tag,
  hubspot,
  EmptyState,
  LoadingSpinner
} from "@hubspot/ui-extensions";

hubspot.extend(({ context, actions }) => (
  <Extension
    context={context}
    fetchProperties={actions.fetchCrmObjectProperties}
    openIframe={actions.openIframeModal}
  />
));

const Extension = ({ context, fetchProperties, openIframe }) => {
  const [bandData, setBandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const APP_ID = "23384795";

  useEffect(() => {
    fetchProperties([
      "hs_object_id",
      `a${APP_ID}_name`,
      `a${APP_ID}_genre`,
      `a${APP_ID}_city`,
      `a${APP_ID}_bandcamp_url`,
      `a${APP_ID}_instagram`,
      `a${APP_ID}_facebook`,
      `a${APP_ID}_spotify_url`,
      `a${APP_ID}_website`,
      `a${APP_ID}_notes`
    ])
      .then((properties) => {
        const normalizedData = {
          name: properties[`a${APP_ID}_name`],
          genre: properties[`a${APP_ID}_genre`],
          city: properties[`a${APP_ID}_city`],
          bandcamp_url: properties[`a${APP_ID}_bandcamp_url`],
          instagram: properties[`a${APP_ID}_instagram`],
          facebook: properties[`a${APP_ID}_facebook`],
          spotify_url: properties[`a${APP_ID}_spotify_url`],
          website: properties[`a${APP_ID}_website`],
          notes: properties[`a${APP_ID}_notes`]
        };
        setBandData(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load band data");
        setLoading(false);
      });
  }, [fetchProperties]);

  const handleBandcampClick = () => {
    const bandcampUrl = bandData?.bandcamp_url;
    if (bandcampUrl) {
      openIframe(
        {
          uri: bandcampUrl,
          height: 600,
          width: 800,
          title: `${bandData?.name || 'Band'} on Bandcamp`,
          flush: false
        },
        () => console.log('Bandcamp modal closed')
      );
    }
  };

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" gap="medium">
        <LoadingSpinner />
        <Text>Loading band info...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <EmptyState title="Error loading band" layout="vertical">
        <Text>{error}</Text>
      </EmptyState>
    );
  }

  const hasBandcampUrl = bandData?.bandcamp_url;
  const hasAnySocialMedia = bandData?.instagram || bandData?.facebook || bandData?.spotify_url || bandData?.website;

  return (
    <Flex direction="column" gap="medium">
      {/* Band Name and Genre */}
      <Flex direction="column" gap="small">
        <Heading>{bandData?.name || 'Band'}</Heading>
        <Flex direction="row" gap="small" align="center">
          {bandData?.genre && (
            <Tag variant="default">{bandData.genre}</Tag>
          )}
          {bandData?.city && (
            <Text format={{ fontWeight: 'medium' }}>📍 {bandData.city}</Text>
          )}
        </Flex>
      </Flex>

      <Divider />

      {/* Bandcamp Player Button */}
      {hasBandcampUrl ? (
        <Box>
          <Flex direction="column" gap="small">
            <Text format={{ fontWeight: 'bold' }}>🎵 Listen Now</Text>
            <Button
              variant="primary"
              onClick={handleBandcampClick}
            >
              Open Bandcamp Player
            </Button>
          </Flex>
        </Box>
      ) : (
        <EmptyState
          title="No Bandcamp URL"
          layout="vertical"
        >
          <Text>Add a Bandcamp URL to listen to this band's music.</Text>
        </EmptyState>
      )}

      {/* Social Media Links */}
      {hasAnySocialMedia && (
        <>
          <Divider />
          <Flex direction="column" gap="small">
            <Text format={{ fontWeight: 'bold' }}>🔗 Connect</Text>
            <Flex direction="column" gap="extraSmall">
              {bandData?.instagram && (
                <Link
                  href={`https://instagram.com/${bandData.instagram.replace('@', '')}`}
                  target="_blank"
                >
                  📷 Instagram: @{bandData.instagram.replace('@', '')}
                </Link>
              )}
              {bandData?.facebook && (
                <Link
                  href={bandData.facebook}
                  target="_blank"
                >
                  👥 Facebook
                </Link>
              )}
              {bandData?.spotify_url && (
                <Link
                  href={bandData.spotify_url}
                  target="_blank"
                >
                  🎧 Spotify
                </Link>
              )}
              {bandData?.website && (
                <Link
                  href={bandData.website}
                  target="_blank"
                >
                  🌐 Website
                </Link>
              )}
            </Flex>
          </Flex>
        </>
      )}

      {/* Notes */}
      {bandData?.notes && (
        <>
          <Divider />
          <Flex direction="column" gap="small">
            <Text format={{ fontWeight: 'bold' }}>📝 Notes</Text>
            <Text>{bandData.notes}</Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

