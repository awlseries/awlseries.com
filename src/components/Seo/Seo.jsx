// src/components/SEO/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Arena Warborn League - Battlefield 6 Esports",
  description = "Official Battlefield 6 competitive gaming league. Join tournaments and compete in BF6 esports!",
  keywords = "battlefield 6, bf6 esports, battlefield 6 tournaments, competitive gaming",
  canonicalUrl = "",
  ogImage = "/images/other/og-bf6-tournaments.jpg"
}) => {
  const fullTitle = title.includes("Arena Warborn League") ? title : `${title} | Arena Warborn League`;
  const baseUrl = "https://awlseries.com";
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${baseUrl}${canonicalUrl}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:url" content={`${baseUrl}${canonicalUrl}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Arena Warborn League" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* VK */}
      <meta property="vk:image" content={`${baseUrl}/images/other/og-bf6-tournaments.jpg`}/>

      {/* Telegram (1 - нестандартный) */}
      <meta property="telegram:channel" content="@awlseries_bot" />
      <meta property="og:telegram:bot" content="@awlseries_bot" />
      <meta property="og:telegram:url" content={`https://t.me/awlseries_bot`} />
    </Helmet>
  );
};

export default SEO;