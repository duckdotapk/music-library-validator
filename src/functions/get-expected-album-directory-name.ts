//
// Function
//

export function getExpectedAlbumDirectoryName(albumName : string) : string
{
	switch (albumName)
	{
		// This album's fucking name, man...
		case "Music to Listen to~Dance to~Blaze to~Pray to~Feed to~Sleep to~Talk to~Grind to~Trip to~Breathe to~Help to~Hurt to~Scroll to~Roll to~Love to~Hate to~Learn Too~Plot to~Play to~Be to~Feel to~Breed to~Sweat to~Dream to~Hide to~Live to~Die to~Go To":
			return "Music to Listen to";

		default:
			break;
	}

	return albumName
		.replaceAll("?", "")
		.replaceAll(":", "");
}