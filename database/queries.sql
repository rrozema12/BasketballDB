-- Query1
SELECT player_name, country FROM Player WHERE country <> "us";

-- Query2
SELECT p.player_name, s.field_goal_pct, p.position FROM Player p NATURAL JOIN ShootingStats s WHERE p.position LIKE "%G%" AND s.field_goal_pct >= (SELECT MAX(s.field_goal_pct) FROM Player p, ShootingStats s WHERE p.position LIKE "%G%" AND p.player_id = s.player_id);

-- Query3
SELECT t.team_name, COUNT(*) AS first_picks FROM Player p, Team t WHERE p.round = 1 AND p.pick_number = 1 AND t.team_code = p.team_code GROUP BY p.team_code ORDER BY first_picks DESC;

-- Query4
SELECT c.college_name, COUNT(*) AS first_picks FROM Player p, College c WHERE p.round = 1 AND p.pick_number = 1 AND c.college_id = p.college_id GROUP BY c.college_id ORDER BY first_picks DESC;

-- Query5
SELECT c.college_name, SUM(s.games_played) AS games_played FROM PerGameStats s, College c, Player p WHERE p.player_id = s.player_id AND p.college_id = c.college_id GROUP BY p.college_id ORDER BY games_played DESC LIMIT 50;

-- Query6
SELECT p.player_name, c.college_name, s.points
FROM Player p, College c, PerGameStats s
WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = 660
HAVING s.points >= (SELECT MAX(s.points)
FROM PerGameStats s, College c, Player p
WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = 660)

UNION

SELECT p.player_name, c.college_name, s.points
FROM Player p, College c, PerGameStats s
WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = 185
HAVING s.points >= (SELECT MAX(s.points)
FROM PerGameStats s, College c, Player p
WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = 185);

-- Query7
SELECT player_name, COUNT(*) AS times_drafted FROM Player GROUP BY player_name HAVING COUNT(*) > 1;

-- Query8
SELECT player_name, to_year - from_year AS career_length FROM Player ORDER BY career_length DESC LIMIT 10;
