import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder home page. Replaced in M6 with the real scoreboard, top 10,
// and leaders. For now it doubles as a smoke test for the UI kit and tokens.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">MinPreps</CardTitle>
          <CardDescription>
            Utah high school basketball. Scores, stats, standings, rankings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge className="bg-win text-win-foreground">W 64-58</Badge>
          <Badge className="bg-loss text-loss-foreground">L 51-70</Badge>
          <Badge variant="outline">6A</Badge>
          <Badge variant="secondary">Region 4</Badge>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Scores</Button>
          <Button size="sm" variant="outline">
            Rankings
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
