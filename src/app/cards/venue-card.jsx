import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Flex,
  Box,
  Divider,
  Heading,
  Tag,
  hubspot,
  LoadingSpinner,
  Statistics,
  StatisticsItem
} from "@hubspot/ui-extensions";

hubspot.extend(({ context, actions }) => (
  <Extension
    context={context}
    fetchProperties={actions.fetchCrmObjectProperties}
  />
));

const Extension = ({ context, fetchProperties }) => {
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch venue properties when component mounts
    fetchProperties([
      "name",
      "city",
      "neighborhood",
      "address",
      "capacity",
      "website",
      "instagram",
      "typical_ticket_price",
      "notes"
    ]).then((properties) => {
      setVenueData(properties);
      setLoading(false);
    });
  }, [fetchProperties]);

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" gap="medium">
        <LoadingSpinner />
        <Text>Loading venue info...</Text>
      </Flex>
    );
  }

  const hasAnySocialMedia = venueData?.instagram || venueData?.website;

  return (
    <Flex direction="column" gap="medium">
      {/* Venue Name and Location */}
      <Flex direction="column" gap="small">
        <Heading>{venueData?.name || 'Venue'}</Heading>
        <Flex direction="row" gap="small" align="center">
          {venueData?.city && (
            <Text format={{ fontWeight: 'medium' }}>📍 {venueData.city}</Text>
          )}
          {venueData?.neighborhood && (
            <Tag variant="default">{venueData.neighborhood}</Tag>
          )}
        </Flex>
        {venueData?.address && (
          <Text>{venueData.address}</Text>
        )}
      </Flex>

      <Divider />

      {/* Venue Stats */}
      <Box>
        <Statistics>
          {venueData?.capacity && (
            <StatisticsItem label="Capacity" number={venueData.capacity} />
          )}
        </Statistics>
        {venueData?.typical_ticket_price && (
          <Flex direction="column" gap="extraSmall">
            <Text format={{ fontWeight: 'bold' }}>💵 Typical Ticket Price</Text>
            <Text>{venueData.typical_ticket_price}</Text>
          </Flex>
        )}
      </Box>

      {/* Social Media Links */}
      {hasAnySocialMedia && (
        <>
          <Divider />
          <Flex direction="column" gap="small">
            <Text format={{ fontWeight: 'bold' }}>🔗 Connect</Text>
            <Flex direction="column" gap="extraSmall">
              {venueData?.website && (
                <Link
                  href={venueData.website}
                  target="_blank"
                >
                  🌐 Website
                </Link>
              )}
              {venueData?.instagram && (
                <Link
                  href={`https://instagram.com/${venueData.instagram.replace('@', '')}`}
                  target="_blank"
                >
                  📷 Instagram: @{venueData.instagram.replace('@', '')}
                </Link>
              )}
            </Flex>
          </Flex>
        </>
      )}

      {/* Notes */}
      {venueData?.notes && (
        <>
          <Divider />
          <Flex direction="column" gap="small">
            <Text format={{ fontWeight: 'bold' }}>📝 Notes</Text>
            <Text>{venueData.notes}</Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

